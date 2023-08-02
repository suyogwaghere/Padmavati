import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  User,
  Ledger,
} from '../models';
import {UserRepository} from '../repositories';

export class UserLedgerController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/ledger', {
    responses: {
      '200': {
        description: 'Ledger belonging to User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Ledger),
          },
        },
      },
    },
  })
  async getLedger(
    @param.path.number('id') id: typeof User.prototype.id,
  ): Promise<Ledger> {
    return this.userRepository.ledger(id);
  }
}
