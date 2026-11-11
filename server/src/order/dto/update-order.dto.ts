import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
  pending = 'pending',
  accepted = 'accepted',
  waiting = 'waiting',
  paid = 'paid',
  delivering = 'delivering',
  sold = 'sold',
  cancelled = 'cancelled',
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: `status must be one of: ${Object.values(OrderStatus).join(', ')}`,
  })
  status!: OrderStatus;
}
