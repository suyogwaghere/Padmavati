import { Constructor, inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MysqlDataSource } from '../datasources';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import { Product, ProductRelations } from '../models';

export class ProductRepository extends TimeStampRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  Constructor<
    DefaultCrudRepository<Product, typeof Product.prototype.id, ProductRelations>
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(Product, dataSource);
  }
}

// export class ProductRepository extends DefaultCrudRepository<
//   Product,
//   typeof Product.prototype.id,
//   ProductRelations
// > {
//   constructor(
//     @inject('datasources.Mysql') dataSource: MysqlDataSource,
//   ) {
//     super(Product, dataSource);
//   }
// }