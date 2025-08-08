import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('create')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('get')
  findAll() {
    return this.orderService.findAll();
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Get('getBuyerOrders/:id')
  findByBuyerId(@Param('id') id: string) {
    console.log("by user id ")
    return this.orderService.findByBuyerId(+id);
  }

  @Get('getSellerOrders/:id')
  findBySellerId(@Param('id') id: string) {
    console.log("by seller id ")
    return this.orderService.findBySellerId(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
