import Dexie, { Table, Transaction } from 'dexie';
import { data as currencies } from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';
import { sample } from 'lodash';
import { DateTime } from 'luxon';

export interface TypedTransaction extends Transaction {
  db: Db;
}

export interface DbTransaction {
  id?: number;
  institutionId: number;
  accountId: number;
  amount: number;
  date: Date;
  tagIds: number[];
}
export interface DbTag {
  id?: number;
  name: string;
  /** Parent */
  tagId: number;
}
export interface DbInstitution {
  id?: number;
  name: string;
  accounts: {
    assetTypeId: number;
  }[];
}
export interface DbAssetType {
  id?: number;
  name: string;
  symbol?: string;
  code: string;
}

class Db extends Dexie {
  readonly transactions!: Table<DbTransaction, number>;
  readonly tags!: Table<DbTag, number>;
  readonly institutions!: Table<DbInstitution, number>;
  readonly assetTypes!: Table<DbAssetType, number>;
  constructor() {
    super('db', {
      autoOpen: true,
    });
    this.version(1).stores({
      transactions: '++id, institutionId, accountId, amount, date, *tagIds',
      tags: '++id, name',
      institutions: '++id, name, *accounts.assetTypeId',
      assetTypes: '++id, &name, symbol, &code',
    });
    this.on('populate', (tx) => this.seed(tx as any));
  }
  async seed(tx: TypedTransaction) {
    const startTime = DateTime.now();
    console.log('Seeding database');
    const assetTypes = currencies.map(c => {
      return ({
        code: c.code,
        name: c.currency,
        symbol: getSymbolFromCurrency(c.code),
      } as DbAssetType);
    });
    (await tx.db.assetTypes.bulkAdd(assetTypes, { allKeys: true })).forEach((key, i) => assetTypes[i].id = key);
    const institutions = [...Array(5).keys()].map(i => ({
      name: `Institute ${i}`,
      accounts: [...Array(3).keys()].map(() => ({
        assetTypeId: Math.floor(Math.random() * assetTypes.length)
      }))
    } as DbInstitution));
    (await tx.db.institutions.bulkAdd(institutions, { allKeys: true })).forEach((key, i) => institutions[i].id = key);
    const transactions = [...Array(5000).keys()].map(i => {
      const institution = sample(institutions);
      return {
        institutionId: institution?.id,
        accountId: Math.floor(Math.random() * institution!.accounts.length),
        amount: Math.random() * 5000,
        date: DateTime.now().minus({ minutes: i * 30 }).toJSDate(),
        tagIds: []
      } as DbTransaction;
    });
    (await tx.db.transactions.bulkAdd(transactions, { allKeys: true })).forEach((key, i) => transactions[i].id = key);

    console.log(`Seeding completed (${DateTime.now().diff(startTime).milliseconds}ms)`);
  }
}

export const db = new Db();