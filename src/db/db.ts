import Dexie, { Table } from 'dexie';

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
}

class Db extends Dexie {
  transactions!: Table<DbTransaction, number>;
  tags!: Table<DbTag, number>;
  institutions!: Table<DbInstitution, number>;
  assetType!: Table<DbAssetType, number>;

  constructor() {
    super('db');
    this.version(1).stores({
      transactions: '++id, accountId, amount, date, *tagIds',
      tags: '++id, name',
      institutions: '++id, name, *accounts.assetTypeId',
      assetType: '++id, name',
    });
    this.seed();
  }
  seed() {
    this.assetType.bulkAdd([
      { name: 'Euro' },
      { name: 'Pound' },
      { name: 'Dollar' },
    ]);
  }
}

export const db = new Db();