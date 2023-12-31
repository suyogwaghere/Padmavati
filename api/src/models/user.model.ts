import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Ledger} from './ledger.model';

@model()
export class User extends Entity {
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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property.array(String, {
    name: 'permissions',
  })
  permissions: String[];

  @property({
    type: 'string',
    required: true,
  })
  contactNo: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @belongsTo(() => Ledger)
  ledgerId: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
