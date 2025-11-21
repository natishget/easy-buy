import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Req() req: any, @Body() createOrderDto: CreateOrderDto[]) {
    const isSeller = req.user?.sub || req.user?.isSeller;
    if(isSeller) {
      throw new Error('Sellers cannot place orders');
    }
    const buyerId = req.user?.sub || req.user?.id || req.user?.userId;
    return this.orderService.create(createOrderDto, buyerId);
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

  @Patch('update/:id')
  updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateStatus(+id, updateOrderDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
