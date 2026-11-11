import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderStatus } from './dto/update-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: any;

  beforeEach(async () => {
    orderService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByBuyerId: jest.fn(),
      findBySellerId: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call orderService.updateStatus with extracted userId', async () => {
    const req = { user: { userId: 5 } };
    orderService.updateStatus.mockResolvedValue({
      id: 1,
      status: OrderStatus.accepted,
    });

    const result = await controller.updateStatus(
      1,
      { status: OrderStatus.accepted },
      req,
    );

    expect(orderService.updateStatus).toHaveBeenCalledWith(5, 1, {
      status: OrderStatus.accepted,
    });
    expect(result).toEqual({ id: 1, status: OrderStatus.accepted });
  });
});
