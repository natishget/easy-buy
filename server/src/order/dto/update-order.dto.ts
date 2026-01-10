import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty, IsString } from 'class-validator';

enum OrderStatus {
    pending = 'pending',
    accepted = 'accepted',
    waiting = 'waiting',
    paid = 'paid',
    delivering = 'delivering',
    sold = 'sold',
    cancelled = 'cancelled'
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsNotEmpty()
    @IsString()
    status!: OrderStatus;
}
