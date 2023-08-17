import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Ledger, LedgerRelations} from '../models';

export class LedgerRepository extends TimeStampRepositoryMixin<
  Ledger,
  typeof Ledger.prototype.id,
  Constructor<
    DefaultCrudRepository<Ledger, typeof Ledger.prototype.id, LedgerRelations>
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.Mysql') dataSource: MysqlDataSource) {
    super(Ledger, dataSource);
  }
  async searchByName(query: string): Promise<Ledger[]> {
    const modelName = this.entityClass.modelName; // Get the model name
    const querys = `
    SELECT * FROM ${modelName} WHERE name LIKE '%${query}%'
  `;
    return this.dataSource.execute(querys);
  }
}
