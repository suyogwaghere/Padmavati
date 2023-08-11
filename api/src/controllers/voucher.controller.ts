/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  // Count,
  // CountSchema,
  DefaultTransactionalRepository,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  // del,
  get,
  getModelSchemaRef,
  param,
  // patch,
  post,
  // put,
  requestBody,
  response,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {MysqlDataSource} from '../datasources';
import {Voucher} from '../models';
import {
  LedgerRepository,
  ProductRepository,
  VoucherProductRepository,
  VoucherRepository,
} from '../repositories';

export class VoucherController {
  constructor(
    @inject('datasources.Mysql')
    public dataSource: MysqlDataSource,
    @repository(LedgerRepository)
    public ledgerRepository: LedgerRepository,
    @repository(VoucherProductRepository)
    public voucherProductRepository: VoucherProductRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(VoucherRepository)
    public voucherRepository: VoucherRepository,
  ) {}

  // @post('/api/vouchers')
  // @response(200, {
  //   description: 'Voucher model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Voucher)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Voucher, {
  //           title: 'NewVoucher',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   voucher: Omit<Voucher, 'id'>,
  // ): Promise<Voucher> {
  //   return this.voucherRepository.create(voucher);
  // }

  // @get('/api/vouchers/count')
  // @response(200, {
  //   description: 'Voucher model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(@param.where(Voucher) where?: Where<Voucher>): Promise<Count> {
  //   return this.voucherRepository.count(where);
  // }

  // @get('/api/vouchers')
  // @response(200, {
  //   description: 'Array of Voucher model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Voucher, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Voucher) filter?: Filter<Voucher>,
  // ): Promise<Voucher[]> {
  //   return this.voucherRepository.find(filter);
  // }

  // @patch('/api/vouchers')
  // @response(200, {
  //   description: 'Voucher PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Voucher, {partial: true}),
  //       },
  //     },
  //   })
  //   voucher: Voucher,
  //   @param.where(Voucher) where?: Where<Voucher>,
  // ): Promise<Count> {
  //   return this.voucherRepository.updateAll(voucher, where);
  // }

  @get('/api/vouchers/{id}')
  @response(200, {
    description: 'Voucher model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Voucher, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Voucher, {exclude: 'where'})
    filter?: FilterExcludingWhere<Voucher>,
  ): Promise<any> {
    try {
      const voucher = await this.voucherRepository.findById(id);

      const voucherProducts = await this.voucherProductRepository.find({
        where: {
          voucherId: voucher.id,
        },
      });

      const updatedVoucherProducts = await Promise.all(
        voucherProducts.map(async voucherProduct => {
          const productData = await this.productRepository.findOne({
            where: {
              productId: voucherProduct.productId,
            },
          });

          return {
            productName: productData?.productName,
            productId: voucherProduct?.productId,
            quantity: voucherProduct?.quantity,
            price: voucherProduct?.price,
            amount: voucherProduct?.amount,
            discount: voucherProduct?.discount,
            uom: voucherProduct?.uom,
            taxRate: voucherProduct?.taxRate,
            notes: voucherProduct?.notes,
          };
        }),
      );

      return {
        ...voucher,
        products: updatedVoucherProducts,
      };
    } catch (error) {
      console.error('Error retrieving vouchers:', error);
      throw new Error('Failed to retrieve vouchers');
    }
  }

  // @patch('/api/vouchers/{id}')
  // @response(204, {
  //   description: 'Voucher PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Voucher, {partial: true}),
  //       },
  //     },
  //   })
  //   voucher: Voucher,
  // ): Promise<void> {
  //   await this.voucherRepository.updateById(id, voucher);
  // }

  // @put('/api/vouchers/{id}')
  // @response(204, {
  //   description: 'Voucher PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() voucher: Voucher,
  // ): Promise<void> {
  //   await this.voucherRepository.replaceById(id, voucher);
  // }

  // @del('/api/vouchers/{id}')
  // @response(204, {
  //   description: 'Voucher DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.voucherRepository.deleteById(id);
  // }
  // NEW UPDATES
  // @authenticate({
  //   strategy: 'jwt',
  //   // options: {required: [PermissionKeys.SALES]},
  // })
  @get('/api/vouchers/syncToBusy')
  async syncVouchersToBusy(
    @param.filter(Voucher) filter?: Filter<Voucher>,
  ): Promise<any[]> {
    try {
      const vouchers = await this.voucherRepository.find({
        where: {
          is_synced: 0, // Filter by is_synced = 0
        },
        fields: {
          createdAt: false,
          updatedAt: false,
        },
        ...filter,
      });

      const updatedVouchers = await Promise.all(
        vouchers.map(async voucher => {
          const voucherProducts = await this.voucherProductRepository.find({
            where: {
              voucherId: voucher.id,
            },
          });

          const updatedVoucherProducts = await Promise.all(
            voucherProducts.map(async voucherProduct => {
              const productData = await this.productRepository.findOne({
                where: {
                  productId: voucherProduct.productId,
                },
              });

              return {
                ProductId: voucherProduct?.productId,
                ProductName: productData?.productName,
                Quantity: voucherProduct?.quantity,
                Price: voucherProduct?.price,
                Amount: voucherProduct?.amount,
                Discount: voucherProduct?.discount,
                Unit: voucherProduct?.uom,
                TaxRate: voucherProduct?.taxRate,
                TaxAmt: voucherProduct?.taxAmt,
                TaxableAMt: voucherProduct?.taxableAMt,
                NetAmt: voucherProduct?.netAmt,

                // godown: voucherProduct?.godown,
                // _godown: voucherProduct?._godown,
                Notes: voucherProduct?.notes,
              };
            }),
          );

          return {
            ...voucher,
            products: updatedVoucherProducts,
          };
        }),
      );

      return updatedVouchers;
    } catch (error) {
      console.error('An error occurred while syncing vouchers:', error);
      throw new Error('Failed to sync vouchers');
    }
  }

  @post('/api/vouchers/syncFromBusy')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: getModelSchemaRef(Voucher),
        },
      },
    },
  })
  async syncFromBusy(
    @requestBody() syncedVoucherData: {syncedVoucherIds: number[]},
  ) {
    const {syncedVoucherIds} = syncedVoucherData;
    try {
      for (const voucherId of syncedVoucherIds) {
        const voucher = await this.voucherRepository.findById(voucherId);
        if (voucher) {
          voucher.is_synced = 1;
          await this.voucherRepository.update(voucher);
        }
      }
      return `Synced status updated for ${syncedVoucherIds.length} vouchers`;
    } catch (error) {
      console.error('Error updating synced vouchers:', error);
      throw new HttpErrors.InternalServerError('Internal Server Error');
    }
  }

  @authenticate({
    strategy: 'jwt',
    // options: {required: [PermissionKeys.SALES]},
  })
  @post('/api/voucher/create')
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currnetUser: UserProfile,
    @requestBody({})
    voucher: any,
  ): Promise<any> {
    const repo = new DefaultTransactionalRepository(Voucher, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      // Check if the voucher object is valid
      if (!voucher || typeof voucher !== 'object') {
        throw new Error('Invalid voucher data');
      }

      // Check if the required properties exist in the voucher object
      const requiredProperties = ['partyId'];
      for (const property of requiredProperties) {
        if (!(property in voucher)) {
          throw new Error(`Missing required property: ${property}`);
        }
      }

      // Fetch the party data from the ledger repository
      const party = await this.ledgerRepository.findOne({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          l_ID: voucher.partyId,
        },
      });

      // Check if the party exists
      if (!party) {
        throw new Error('Party not found');
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year}`;

      let totalAmount = 0;
      let totalQuantity = 0;

      for (const product of voucher.products) {
        totalAmount += product.quantity * product.sellPrice;
        totalQuantity += product.quantity;
      }

      const voucherCreateData = {
        voucherDate: formattedDate,
        // voucherSeries: 'S',
        // voucherNo: 'S-1101',
        Saletype: 'L/GST-TaxIncl',
        McName: 'Santacruz East',
        // voucher_type: 'Sales',
        // _voucher_type: 'e5a9b5a7-7f09-4ac0-a2cd-f5aa3ad03acf-00000026',
        partyName: party.name,
        partyId: party.l_ID,
        // place_of_supply: 'Goa',
        // is_invoice: true,
        // is_accounting_voucher: true,
        // is_inventory_voucher: false,
        // is_order_voucher: false,
        adminNote: voucher.adminNote || ' ',
        is_synced: 0,
        totalAmount: totalAmount,
        totalQuantity: totalQuantity,
        userId: currnetUser.id,
      };

      const newVoucher = await this.voucherRepository.create(
        voucherCreateData,
        {
          transaction: tx,
        },
      );

      const voucherProducts = voucher.products.map((product: any) => {
        const taxRate = parseFloat(product.taxRate);
        const quantity = parseInt(product.quantity);
        const price = parseFloat(product.sellPrice);

        const amount = quantity * price;
        const taxAmt = (amount * taxRate) / 100;
        const taxableAmt = amount - taxAmt;
        const netAmt = amount + taxAmt;
        return {
          voucherId: newVoucher.id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.sellPrice,
          amount: amount,
          discount: product.discount || '',
          uom: product.uom,
          taxRate: product.taxRate,
          taxAmt: taxAmt,
          taxableAMt: taxableAmt,
          netAmt: netAmt,
          // godown: 'Main Location',
          // _godown: 'e5a9b5a7-7f09-4ac0-a2cd-f5aa3ad03acf-0000003a',
          notes: product.notes,
        };
      });
      await this.voucherProductRepository.createAll(voucherProducts, {
        transaction: tx,
      });
      await tx.commit();
      // return newVoucher;

      return await Promise.resolve({
        newVoucher,
        success: true,
        message: 'Voucher products created successfully',
      });
    } catch (error) {
      await tx.rollback();

      // Handle errors and return appropriate response
      console.error('Error creating voucher:', error);
      throw new Error('Failed to create voucher');
    }
  }

  @authenticate({
    strategy: 'jwt',
    //   options: {required: [PermissionKeys.SALES]},
  })
  @post('/api/voucher/update')
  async updateVoucher(@requestBody({}) voucherData: any): Promise<any> {
    const repo = new DefaultTransactionalRepository(Voucher, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    console.log(
      '🚀 ~ file: voucher.controller.ts:451 ~ VoucherController ~ updateVoucher ~ voucher:',
      voucherData,
    );
    try {
      const voucher = await this.voucherRepository.findById(
        parseInt(voucherData.voucherNumber),
      );

      if (!voucher) {
        throw new HttpErrors.NotFound('Voucher not found');
      }
      const party = await this.ledgerRepository.findOne({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          l_ID: voucherData.partyId,
        },
      });

      if (!party) {
        throw new HttpErrors.UnprocessableEntity('Party not found');
      }

      let totalAmountData = 0;
      let totalQuantityData = 0;

      for (const product of voucherData.products) {
        totalQuantityData += product.quantity;
        totalAmountData += product.quantity * product.price;
      }

      const voucherUpdateData = {
        voucherDate: voucherData.date || ' ',
        Saletype: voucherData.Saletype || ' ',
        McName: voucherData.McName || ' ',
        // voucher_type: 'Sales',
        // _voucher_type: 'e5a9b5a7-7f09-4ac0-a2cd-f5aa3ad03acf-00000026',
        partyName: party.name,
        partyId: party.l_ID,
        // place_of_supply: 'Goa',
        // is_invoice: true,
        // is_accounting_voucher: true,
        // is_inventory_voucher: false,
        // is_order_voucher: false,
        adminNote: voucherData.adminNote || ' ',
        is_synced: 0,
        totalAmount: totalAmountData,
        totalQuantity: totalQuantityData,
      };
      await this.voucherRepository.updateById(voucher.id, voucherUpdateData, {
        transaction: tx,
      });

      const voucherProducts: any[] = await Promise.all(
        voucherData.products.map(async (product: any) => {
          const productData = await this.productRepository.findOne({
            where: {productId: product.productId},
          });
          const taxRate = parseFloat(product.taxRate);
          const quantity = parseInt(product.quantity);
          const price = parseFloat(product.price);

          const amount = quantity * price;
          const taxAmt = (amount * taxRate) / 100;
          const taxableAmt = amount - taxAmt;
          const netAmt = amount + taxAmt;
          return {
            voucherId: voucher.id,
            productId: productData?.productId,
            quantity: product.quantity,
            price: product.price,
            amount: product.price * product.quantity, // Calculate the total amount for each product
            discount: product.discount || 0,
            uom: product.uom || ' ',
            taxRate: product.taxRate,
            taxAmt: taxAmt,
            taxableAMt: taxableAmt,
            netAmt: netAmt,
            // godown: 'Main Location',
            // _godown: 'e5a9b5a7-7f09-4ac0-a2cd-f5aa3ad03acf-0000003a',
            notes: product.notes,
          };
        }),
      );
      await this.voucherProductRepository.deleteAll(
        {
          voucherId: voucher.id,
        },
        {
          transaction: tx,
        },
      );
      await this.voucherProductRepository.createAll(voucherProducts, {
        transaction: tx,
      });

      await tx.commit();

      return await Promise.resolve({
        success: true,
        message: 'Voucher products updated successfully',
      });
    } catch (error) {
      await tx.rollback();
      console.log('Error updating voucher:', error);
      throw new HttpErrors.InternalServerError('Failed to update voucher');
    }
  }

  @authenticate({
    strategy: 'jwt',
    // options: {required: [PermissionKeys.SALES]},
  })
  @get('/api/vouchers/list')
  async find(@param.filter(Voucher) filter?: Filter<Voucher>): Promise<any[]> {
    try {
      const vouchers = await this.voucherRepository.find({
        include: [
          {
            relation: 'user',
            scope: {
              fields: {
                password: false,
                otp: false,
                otpExpireAt: false,
              },
            },
          },
        ],
        ...filter,
      });

      const updatedVouchers = await Promise.all(
        vouchers.map(async voucher => {
          const voucherProducts = await this.voucherProductRepository.find({
            where: {
              voucherId: voucher.id,
            },
          });

          const updatedVoucherProducts = await Promise.all(
            voucherProducts.map(async voucherProduct => {
              const productData = await this.productRepository.findOne({
                where: {
                  productId: voucherProduct.productId,
                },
              });

              return {
                productName: productData?.productName,
                productGuid: voucherProduct?.productId,
                quantity: voucherProduct?.quantity,
                price: voucherProduct?.price,
                amount: voucherProduct?.amount,
                discount: voucherProduct?.discount,
                // godown: voucherProduct?.godown,
                // _godown: voucherProduct?._godown,
                notes: voucherProduct?.notes,
              };
            }),
          );

          return {
            ...voucher,
            products: updatedVoucherProducts,
          };
        }),
      );

      return updatedVouchers;
    } catch (error) {
      console.error('Error retrieving vouchers:', error);
      throw new Error('Failed to retrieve vouchers');
    }
  }

  @authenticate({
    strategy: 'jwt',
    // options: {required: [PermissionKeys.SALES]},
  })
  @get('/api/vouchers/user/list')
  async getVoucherWithUser(
    @inject(AuthenticationBindings.CURRENT_USER) currnetUser: UserProfile,
    @param.filter(Voucher) filter?: Filter<Voucher>,
  ): Promise<any[]> {
    try {
      const vouchers = await this.voucherRepository.find({
        where: {
          userId: currnetUser.id,
        },
        ...filter,
      });

      const updatedVouchers = await Promise.all(
        vouchers.map(async voucher => {
          const voucherProducts = await this.voucherProductRepository.find({
            where: {
              voucherId: voucher.id,
            },
          });

          const updatedVoucherProducts = await Promise.all(
            voucherProducts.map(async voucherProduct => {
              const productData = await this.productRepository.findOne({
                where: {
                  productId: voucherProduct.productId,
                },
              });

              return {
                productName: productData?.productName,
                productId: voucherProduct?.productId,
                quantity: voucherProduct?.quantity,
                price: voucherProduct?.price,
                amount: voucherProduct?.amount,
                discount: voucherProduct?.discount,
                // godown: voucherProduct?.godown,
                // _godown: voucherProduct?._godown,
                notes: voucherProduct?.notes,
              };
            }),
          );

          return {
            ...voucher,
            products: updatedVoucherProducts,
          };
        }),
      );

      return updatedVouchers;
    } catch (error) {
      console.error('Error retrieving vouchers:', error);
      throw new Error('Failed to retrieve vouchers');
    }
  }
}
