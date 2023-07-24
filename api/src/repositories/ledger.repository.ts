import { Constructor, inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import { Ledger, LedgerRelations } from '../models';



export class LedgerRepository extends TimeStampRepositoryMixin<
  Ledger,
  typeof Ledger.prototype.id,
  Constructor<
    DefaultCrudRepository<Ledger, typeof Ledger.prototype.id, LedgerRelations>
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(Ledger, dataSource);
  }
}

// export class LedgerRepository extends DefaultCrudRepository<
//   Ledger,
//   typeof Ledger.prototype.id,
//   LedgerRelations
// > {
//   constructor(
//     @inject('datasources.Mysql') dataSource: MysqlDataSource,
//   ) {
//     super(Ledger, dataSource);
//   }
// }?


