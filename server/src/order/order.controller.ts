import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
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
    const isSeller = !!req.user?.isSeller || req.user?.role === 'seller';
    if (isSeller) {
      throw new ForbiddenException('Sellers cannot place orders');
    }
    const buyerId = Number(req.user?.userId || req.user?.id || req.user?.sub);
    if (!buyerId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.orderService.create(createOrderDto, buyerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('get/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getBuyerOrders')
  findByBuyerId(@Req() req: any) {
    const isSeller = !!req.user?.isSeller || req.user?.role === 'seller';
    if (isSeller) {
      throw new ForbiddenException('Buyers cannot access seller orders');
    }
    const buyerId = Number(req.user?.userId || req.user?.id || req.user?.sub);
    if (!buyerId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.orderService.findByBuyerId(buyerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSellerOrders')
  findBySellerId(@Req() req: any) {
    const isSeller = !!req.user?.isSeller || req.user?.role === 'seller';
    if (!isSeller) {
      throw new ForbiddenException('Buyers cannot access seller orders');
    }
    const sellerId = Number(req.user?.userId || req.user?.id || req.user?.sub);
    if (!sellerId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.orderService.findBySellerId(sellerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateStatus/:id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ) {
    const userId = Number(req.user?.userId || req.user?.id || req.user?.sub);
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.orderService.updateStatus(userId, id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
