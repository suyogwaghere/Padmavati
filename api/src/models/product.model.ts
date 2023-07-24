/* eslint-disable @typescript-eslint/naming-convention */
import { Entity, model, property } from '@loopback/repository';

@model()
export class Product extends Entity {
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
   parentId?: string;
  
  
  @property({
    type: 'string',
    required: true,
  })
  parentName?: string;

  @property({
    type: 'string',
    required: true,
  })
  productName?: string;

@property({
    type: 'string',
    required: true,
  })
uom: string;
  
  @property({
    type: 'number',
    required: true,
  })
  stock: number;

   @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  sellPrice?: number;
  
  @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  purchasePrice?: number;
  
  @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  openingBalance?: number;
  
  @property({
    type: 'number',
    required: true,
    default: 0,
    dataType: 'decimal',
    precision: 30,
    scale: 2,
  })
  openingValue?: number;

 

  @property({
    type: 'number',
    required: true,
  })
  taxRate?: number;

  @property({
    type: 'string',
  })
  gst_hsn_code?: string;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
