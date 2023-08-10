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
class UniqueParentProduct {
  constructor(public parentId: any, public parentName: any) {}
}
export class ProductController {
  constructor(
    @inject('datasources.Mysql')
    public dataSource: MysqlDataSource,
    @repository(ProductRepository)
    public productRepository: ProductRepository, // @inject(RestBindings.Http.REQUEST) private request: Request, // Import Request // @inject('service.tally.service') // public tallyPostService: TallyHttpCallService,
  ) {}

  @authenticate({
    strategy: 'jwt',
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
        description: 'Product Sync',
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
        // function extractTaxRate(taxRate: string) {
        //   // Remove "GST" and "%" from the string
        //   const taxRateWithoutGST = taxRate.replace(/GST|%/g, '');

        //   // Convert the remaining numerical data to a number
        //   const numericalTaxRate = Number(taxRateWithoutGST);

        //   return numericalTaxRate;
        // }
        await this.productRepository.deleteAll(undefined, {transaction: tx});
        const finalMappedObject: Product[] = parsedData.map((product: any) => {
          const mappedProduct: Product = new Product();
          mappedProduct.parentId = product.parentId || ' ';
          mappedProduct.parentName = product.parentName || ' ';
          mappedProduct.productName = product.productName || ' ';
          mappedProduct.productId = product.productId || ' ';
          mappedProduct.uom = product.uom || ' ';
          mappedProduct.stock = product.stock || 0;
          mappedProduct.discount = product.discount || 0;
          mappedProduct.MRP = product.MRP || 0;
          mappedProduct.sellPrice = product.sellPrice || 0;
          mappedProduct.purchasePrice = product.purchasePrice || 0;
          mappedProduct.openingBalance = product.openingBalance || 0;
          mappedProduct.openingValue = product.openingValue || 0;
          mappedProduct.taxRate = product.taxRate || 0;
          mappedProduct.sgst = product.sgst || 0;
          mappedProduct.cgst = product.cgst || 0;
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
  })
  @get('/api/products/list')
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }
  //Get all product parents
  @authenticate({
    strategy: 'jwt',
  })
  @get('/api/products/parent/list')
  async findParents(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<UniqueParentProduct[]> {
    const parentProducts = await this.productRepository.find(filter);

    // Create a Map to store unique parentName and parentId combinations
    const uniqueParentsMap = new Map<string, string>();

    // Iterate through parentProducts and add unique combinations to the map
    parentProducts.forEach(parentProduct => {
      if (parentProduct.parentId && parentProduct.parentName) {
        // Check if parentId is defined
        uniqueParentsMap.set(parentProduct.parentId, parentProduct.parentName);
      }
    });

    // Create an array of objects from the Map's entries
    const uniqueParentProductResponses: UniqueParentProduct[] = Array.from(
      uniqueParentsMap.entries(),
    ).map(([parentId, parentName]) => ({
      parentId,
      parentName,
    }));

    return uniqueParentProductResponses;
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
  async findById(@param.path.number('id') id: number): Promise<any> {
    const products = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });
    return Promise.resolve({
      ...products,
    });
  }

  //Update product by ID
  @authenticate({
    strategy: 'jwt',
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
  })
  @del('/api/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.number('id') guid: number): Promise<void> {
    await this.productRepository.deleteById(guid);
  }

  // searching
  @get('/api/products/search')
  async searchByName(
    @param.query.string('query') query: string,
  ): Promise<Product[]> {
    return this.productRepository.searchByName(query);
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
