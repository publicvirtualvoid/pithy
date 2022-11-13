import Dexie, { Table } from 'dexie';
import { data as currencies } from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

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
    this.seed();
  }
  seed() {
    this.assetTypes.clear();
    this.assetTypes.bulkAdd(currencies.map(c => {
      return ({
        code: c.code,
        name: c.currency,
        symbol: getSymbolFromCurrency(c.code),
      });
    }));
  }
}

export const db = new Db();