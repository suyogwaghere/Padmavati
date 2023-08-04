import {Constructor, Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {User, Voucher, VoucherRelations} from '../models';
import {UserRepository} from './user.repository';

export class VoucherRepository extends TimeStampRepositoryMixin<
  Voucher,
  typeof Voucher.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Voucher,
      typeof Voucher.prototype.id,
      VoucherRelations
    >
  >
>(DefaultCrudRepository) {
  public readonly user: BelongsToAccessor<User, typeof Voucher.prototype.id>;

  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Voucher, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
