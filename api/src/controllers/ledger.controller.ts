/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  DefaultTransactionalRepository,
  Filter,
  FilterExcludingWhere,
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
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {MysqlDataSource} from '../datasources';
import {Ledger} from '../models';
import {LedgerRepository} from '../repositories';

export class LedgerController {
  constructor(
    @inject('datasources.Mysql')
    public dataSource: MysqlDataSource,
    @repository(LedgerRepository)
    public ledgerRepository: LedgerRepository,
  ) {}

  @post('/api/ledgers')
  @response(200, {
    description: 'Ledger model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ledger)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {
            title: 'NewLedger',
            exclude: ['id'],
          }),
        },
      },
    })
    ledger: Omit<Ledger, 'id'>,
  ): Promise<Ledger> {
    return this.ledgerRepository.create(ledger);
  }

  @get('/api/ledgers/count')
  @response(200, {
    description: 'Ledger model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Ledger) where?: Where<Ledger>): Promise<Count> {
    return this.ledgerRepository.count(where);
  }

  //Get all products
  @authenticate({
    strategy: 'jwt',
  })
  @get('/api/ledgers/list')
  async find(@param.filter(Ledger) filter?: Filter<Ledger>): Promise<Ledger[]> {
    return this.ledgerRepository.find(filter);
  }

  // @get('/ledgers')
  // @response(200, {
  //   description: 'Array of Ledger model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Ledger, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(@param.filter(Ledger) filter?: Filter<Ledger>): Promise<Ledger[]> {
  //   return this.ledgerRepository.find(filter);
  // }
  // ///////////////////////////////////

  @post('/api/ledgers/sync', {
    responses: {
      '200': {
        description: 'Ledger sync ',
        content: {
          schema: getJsonSchemaRef(Ledger),
        },
      },
    },
  })
  async syncLedgers(@requestBody() ledgerData: any) {
    try {
      //          const request = this.request; // Import the Request object
      //   const parsedData: any = await bodyPaser.json(request); // Parse the request body directly
      const parsedData = await ledgerData.ledger;
      console.log('parsedData ', parsedData);

      const repo = new DefaultTransactionalRepository(Ledger, this.dataSource);
      const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
      try {
        await this.ledgerRepository.deleteAll(undefined, {transaction: tx});
        const finalMappedObject: Ledger[] = parsedData.map((ledger: any) => {
          const mappedLedger: Ledger = new Ledger();
          mappedLedger.name = ledger.name || ' ';
          mappedLedger.group = ledger.group || ' ';
          mappedLedger.guid = ledger.guid || ' ';
          mappedLedger.openingValue = ledger.openingValue * 1 || 0;
          mappedLedger.address = ledger.address || ' ';
          mappedLedger.country = ledger.country || ' ';
          mappedLedger.state = ledger.state || ' ';
          mappedLedger.gstIn = ledger.gstIn || ' ';
          mappedLedger.whatsapp_no = ledger.whatsapp_no || ' ';
          mappedLedger.mobile_no = ledger.mobile_no || ' ';
          mappedLedger.pincode = ledger.pincode * 1 || 0;
          mappedLedger.station = ledger.station || ' ';
          mappedLedger.l_ID = ledger.l_ID || ' ';

          return mappedLedger;
        });
        await this.ledgerRepository.createAll(finalMappedObject, {
          transaction: tx,
        });
        await tx.commit();
        return {
          success: true,
          message: `Ledgers synced successfully.`,
        };
      } catch (err) {
        console.log('Error ', err);
        await tx.rollback();
        throw new Error(
          'Error synchronizing ledgers. Transaction rolled back.',
        );
      }
    } catch (error) {
      throw new HttpErrors.PreconditionFailed(error.message);
    }
  }
  // ///////////////////////////////////
  @patch('/api/ledgers')
  @response(200, {
    description: 'Ledger PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
    ledger: Ledger,
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.ledgerRepository.updateAll(ledger, where);
  }

  @get('/api/ledgers/{id}')
  @response(200, {
    description: 'Ledger model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ledger, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Ledger, {exclude: 'where'})
    filter?: FilterExcludingWhere<Ledger>,
  ): Promise<Ledger> {
    return this.ledgerRepository.findById(id, filter);
  }

  @patch('/api/ledgers/{id}')
  @response(204, {
    description: 'Ledger PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
    ledger: Ledger,
  ): Promise<void> {
    await this.ledgerRepository.updateById(id, ledger);
  }

  @put('/api/ledgers/{id}')
  @response(204, {
    description: 'Ledger PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ledger: Ledger,
  ): Promise<void> {
    await this.ledgerRepository.replaceById(id, ledger);
  }

  @del('/api/ledgers/{id}')
  @response(204, {
    description: 'Ledger DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ledgerRepository.deleteById(id);
  }
}
