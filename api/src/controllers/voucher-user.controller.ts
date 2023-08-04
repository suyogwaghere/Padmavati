import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {User, Voucher} from '../models';
import {VoucherRepository} from '../repositories';

export class VoucherUserController {
  constructor(
    @repository(VoucherRepository)
    public voucherRepository: VoucherRepository,
  ) {}

  @get('/api/vouchers/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Voucher',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Voucher.prototype.id,
  ): Promise<User> {
    return this.voucherRepository.user(id);
  }
}
