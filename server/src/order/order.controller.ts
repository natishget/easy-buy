import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get('getBuyerOrders')
  findByBuyerId(@Req() req: any) {
    const isSeller = !!req.user?.isSeller || req.user?.role === 'seller';
    if (isSeller) {
      throw new ForbiddenException('Buyers cannot access seller orders');
    }
    const buyerId = Number(req.user?.sub || req.user?.id || req.user?.userId)
    return this.orderService.findByBuyerId(buyerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSellerOrders/')
  findBySellerId(@Req() req: any) {
    const isSeller = !!req.user?.isSeller || req.user?.role === 'seller';
    if (!isSeller) {
      throw new ForbiddenException('Buyers cannot access seller orders');
    }
    const sellerId = Number(req.user?.sub || req.user?.id || req.user?.userId);
    return this.orderService.findBySellerId(sellerId);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateStatus/:id')
  updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Req() req: any) {
    const userId = req.user?.sub || req.user?.id || req.user?.userId;
    return this.orderService.updateStatus(+userId, +id, updateOrderDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
