import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {VoucherProduct, VoucherProductRelations} from '../models';

export class VoucherProductRepository extends DefaultCrudRepository<
  VoucherProduct,
  typeof VoucherProduct.prototype.id,
  VoucherProductRelations
> {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(VoucherProduct, dataSource);
  }
}
