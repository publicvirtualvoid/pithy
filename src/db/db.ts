import Dexie, { Table, Transaction } from 'dexie';
import { data as currencies } from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

export interface TypedTransaction extends Transaction {
  db: Db;
}

export interface DbTransaction {
  id?: number;
  accountId: number;
  amount: number;
  date: Date;
  tagIds: number[];
}
export interface DbTag {
  id?: number;
  name: string;
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
  transactions!: Table<DbTransaction, number>;
  tags!: Table<DbTag, number>;
  institutions!: Table<DbInstitution, number>;
  assetTypes!: Table<DbAssetType, number>;

  constructor() {
    super('db', {
      autoOpen: true,
    });
    this.version(1).stores({
      transactions: '++id, accountId, amount, date, *tagIds',
      tags: '++id, name',
      institutions: '++id, name, *accounts.assetTypeId',
      assetTypes: '++id, &name, symbol, &code',
    });
    this.on('populate', (tx) => this.seed(tx as any));
  }
  async seed(tx: TypedTransaction) {
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
    tx.db.institutions.bulkAdd(institutions);
  }
}

export const db = new Db();