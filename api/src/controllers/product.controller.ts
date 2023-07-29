/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  DefaultTransactionalRepository,
  Filter,
  IsolationLevel,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getJsonSchemaRef,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {PermissionKeys} from '../authorization/permission-keys';
// import { MysqlDataSource } from '../datasources';
import {inject} from '@loopback/context';
import {MysqlDataSource} from '../datasources';
import {Product} from '../models';
import {ProductRepository} from '../repositories';

export class ProductController {
  constructor(
    @inject('datasources.Mysql')
    public dataSource: MysqlDataSource,
    @repository(ProductRepository)
    public productRepository: ProductRepository, // @inject(RestBindings.Http.REQUEST) private request: Request, // Import Request // @inject('service.tally.service') // public tallyPostService: TallyHttpCallService,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.SUPER_ADMIN]},
  })
  @post('/api/products')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody() requestData: {product: Product; variations: any[]},
  ): Promise<any> {
    // const repo = new DefaultTransactionalRepository(Product, this.dataSource);
    // const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    // try {
    //   const {product, variations} = requestData;
    //   const createdProduct = await this.productRepository.create(product, {
    //     transaction: tx,
    //   });
    //   for (const variation of variations) {
    //     let existingVariation = await this.variationRepository.findOne({
    //       where: {name: variation.name},
    //     });
    //     if (!existingVariation) {
    //       const inputVariation = {
    //         name: variation.name,
    //       };
    //       existingVariation = await this.variationRepository.create(
    //         inputVariation,
    //       );
    //     }
    //     const productVariation = new ProductVariation({
    //       productId: createdProduct.id,
    //       variationId: existingVariation.id,
    //       mrp: variation.mrp,
    //       sellingPrice: variation.sellingPrice,
    //       sku: variation.sku,
    //       stock: variation.stock,
    //     });
    //     await this.productVariationRepository.create(productVariation, {
    //       transaction: tx,
    //     });
    //   }
    //   await tx.commit();
    //   return createdProduct;
    // } catch (err) {
    //   await tx.rollback();
    //   throw err;
    // }
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.SUPER_ADMIN]},
  })
  @get('/api/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Product) where?: Where<Product>): Promise<Count> {
    return this.productRepository.count(where);
  }

  //Get sync products
  @post('/api/products/sync', {
    responses: {
      '200': {
        description: 'Product Sync Success',
        content: {
          schema: getJsonSchemaRef(Product),
        },
      },
    },
  })
  async syncProducts(@requestBody() productData: any) {
    try {
      //          const request = this.request; // Import the Request object
      //   const parsedData: any = await bodyPaser.json(request); // Parse the request body directly
      const parsedData = await productData.product;
      console.log('parsedData ', parsedData);

      const repo = new DefaultTransactionalRepository(Product, this.dataSource);
      const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
      try {
        await this.productRepository.deleteAll(undefined, {transaction: tx});
        const finalMappedObject: Product[] = parsedData.map((product: any) => {
          const mappedProduct: Product = new Product();
          mappedProduct.parentId = product.parentId || ' ';
          mappedProduct.parentName = product.parentName || ' ';
          mappedProduct.productName = product.productName || ' ';
          mappedProduct.productId = product.productId || ' ';
          mappedProduct.uom = product.uom || ' ';
          mappedProduct.stock = product.stock * 1 || 0;
          mappedProduct.discount = product.discount * 1 || 0;
          mappedProduct.sellPrice = product.sellPrice * 1 || 0;
          mappedProduct.purchasePrice = product.purchasePrice * 1 || 0;
          mappedProduct.openingBalance = product.openingBalance * 1 || 0;
          mappedProduct.openingValue = product.openingValue * 1 || 0;
          mappedProduct.taxRate = product.taxRate || ' ';
          mappedProduct.sgst = product.sgst || ' ';
          mappedProduct.cgst = product.cgst || ' ';
          mappedProduct.gst_hsn_code = product.gst_hsn_code || ' ';
          mappedProduct.image = product.image || ' ';

          return mappedProduct;
        });
        await this.productRepository.createAll(finalMappedObject, {
          transaction: tx,
        });
        await tx.commit();
        return {
          success: true,
          message: `Products synced successfully`,
        };
      } catch (err) {
        console.log('Error ', err);

        await tx.rollback();
        throw new Error(
          'Error synchronizing products. Transaction rolled back.',
        );
      }
    } catch (error) {
      throw new HttpErrors.PreconditionFailed(error.message);
    }
  }
  ////////////////////////////?
  //Get all products
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.SUPER_ADMIN]},
  })
  @get('/api/products/list')
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  //Find product by ID
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.SUPER_ADMIN]},
  })
  @get('/api/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async findById(@param.path.number('id') id: string): Promise<any> {
    // const product = await this.productRepository.findById(id);
    // if (!product) {
    //   throw new HttpErrors.NotFound('Product not found');
    // }
    // Retrieve variations using the junction table
    // const productVariations = await this.productRepository
    //   .variations(id)
    //   .find();
    // // Map the variations to the product object
    // const updatedVariationsWithJunctionData = await Promise.all(
    //   productVariations.map(async res => {
    //     const variationData = await this.productVariationRepository.findOne({
    //       where: {
    //         productId: id,
    //         variationId: res.id,
    //       },
    //     });
    //     if (variationData) {
    //       return {
    //         name: res.name,
    //         id: res.id,
    //         ...variationData,
    //       };
    //     } else {
    //       return {
    //         name: res.name,
    //         id: res.id,
    //       };
    //     }
    //   }),
    // );
    // return product;
  }

  //Update product by ID
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.SUPER_ADMIN]},
  })
  @patch('/api/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() requestData: {product: Product; variations: any[]},
  ): Promise<any> {
    // const repo = new DefaultTransactionalRepository(Product, this.dataSource);
    // const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    // try {
    //   const {product, variations} = requestData;
    //   await this.productRepository.updateById(id, product, {transaction: tx});
    //   // Delete previous variations that are not included in the updated variations
    //   await this.productVariationRepository.deleteAll(
    //     {productId: id},
    //     {transaction: tx},
    //   );
    //   for (const variation of variations) {
    //     let existingVariation = await this.variationRepository.findOne({
    //       where: {name: variation.name},
    //     });
    //     if (!existingVariation) {
    //       const inputVariation = {
    //         name: variation.name,
    //       };
    //       existingVariation = await this.variationRepository.create(
    //         inputVariation,
    //         {transaction: tx},
    //       );
    //     }
    //     const productVariation = new ProductVariation({
    //       productId: id,
    //       variationId: existingVariation.id,
    //       mrp: variation.mrp,
    //       sellingPrice: variation.sellingPrice,
    //       sku: variation.sku,
    //       stock: variation.stock,
    //     });
    //     await this.productVariationRepository.create(productVariation, {
    //       transaction: tx,
    //     });
    //   }
    //   await tx.commit();
    //   return await Promise.resolve({
    //     success: true,
    //     message: 'Product updated successfully',
    //   });
    // } catch (err) {
    //   await tx.rollback();
    //   throw err;
    // }
  }

  //Delete product by ID
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.SUPER_ADMIN]},
  })
  @del('/api/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.number('id') guid: number): Promise<void> {
    await this.productRepository.deleteById(guid);
  }

  //   @authenticate({
  //     strategy: 'jwt',
  //     options: {required: [PermissionKeys.SUPER_ADMIN]},
  //   })
  //   @get('/api/products/parents')
  //   async getProductParents(
  //     @param.filter(Product) filter?: Filter<Product>,
  //   ): Promise<any> {
  //     // const products = await this.productRepository.find(filter);

  //     // Create a Set to store unique parent values
  //     const uniqueParents = new Set<string>();

  //     // Filter out duplicates and store unique parents in the Set
  //     // products.forEach(product => uniqueParents.add(product.parent));

  //     // Convert the Set back to an array
  //     const uniqueParentsArray = Array.from(uniqueParents);

  //     return uniqueParentsArray.map(parent => {
  //       return {
  //         parent,
  //       };
  //     });
  //   }
}
