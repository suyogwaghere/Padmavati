import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Voucher extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  partyName: string;

  @property({
    type: 'string',
    required: true,
  })
  partyId: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  totalAmount: number;

  @property({
    type: 'number',
    required: true,
  })
  totalQuantity: number;

  @property({
    type: 'string',
    required: true,
  })
  voucherDate: string;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Voucher>) {
    super(data);
  }
}

export interface VoucherRelations {
  // describe navigational properties here
}

export type VoucherWithRelations = Voucher & VoucherRelations;
