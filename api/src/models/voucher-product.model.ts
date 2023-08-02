import {Entity, model, property} from '@loopback/repository';

@model()
export class VoucherProduct extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;
  @property({
    type: 'number',
  })
  voucherId?: number;
  @property({
    type: 'string',
    required: true,
  })
  productName: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  amount: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  discount: number;

  @property({
    type: 'string',
    required: true,
  })
  notes: string;

  constructor(data?: Partial<VoucherProduct>) {
    super(data);
  }
}

export interface VoucherProductRelations {
  // describe navigational properties here
}

export type VoucherProductWithRelations = VoucherProduct &
  VoucherProductRelations;
