import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {User, UserRelations, Ledger} from '../models';
import {LedgerRepository} from './ledger.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends TimeStampRepositoryMixin<
  User,
  typeof User.prototype.id,
  Constructor<
    DefaultCrudRepository<User, typeof User.prototype.id, UserRelations>
  >
>(DefaultCrudRepository) {

  public readonly ledger: BelongsToAccessor<Ledger, typeof User.prototype.id>;

  constructor(@inject('datasources.Mysql') dataSource: MysqlDataSource, @repository.getter('LedgerRepository') protected ledgerRepositoryGetter: Getter<LedgerRepository>,) {
    super(User, dataSource);
    this.ledger = this.createBelongsToAccessorFor('ledger', ledgerRepositoryGetter,);
    this.registerInclusionResolver('ledger', this.ledger.inclusionResolver);
  }
}
