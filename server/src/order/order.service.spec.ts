import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { OrderStatus } from './dto/update-order.dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('OrderService - updateStatus', () => {
  let service: OrderService;
  let prisma: any;
  let notificationService: any;

  const mockOrder = {
    id: 1,
    productId: 10,
    buyerId: 2,
    quantity: 3,
    status: OrderStatus.pending,
    product: {
      id: 10,
      sellerId: 1,
      quantity: 5,
      seller: { id: 1, name: 'Seller User', email: 'seller@test.com' },
    },
    buyer: { id: 2, name: 'Buyer User', email: 'buyer@test.com' },
  };

  beforeEach(async () => {
    prisma = {
      order: {
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      product: {
        update: jest.fn(),
      },
      $transaction: jest.fn(async (ops: any[]) => {
        // If promises or queries are passed, resolve them
        return Promise.all(
          ops.map((op) => (typeof op === 'function' ? op() : op)),
        );
      }),
    };

    notificationService = {
      sendToUser: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should throw NotFoundException if order does not exist', async () => {
    prisma.order.findUnique.mockResolvedValue(null);

    await expect(
      service.updateStatus(1, 999, { status: OrderStatus.accepted }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is neither buyer nor seller', async () => {
    prisma.order.findUnique.mockResolvedValue({ ...mockOrder });

    await expect(
      service.updateStatus(99, 1, { status: OrderStatus.accepted }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow seller to accept a pending order without double decrementing stock', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.pending,
    });
    prisma.order.update.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.accepted,
    });

    const result = await service.updateStatus(1, 1, {
      status: OrderStatus.accepted,
    });

    expect(result.status).toBe(OrderStatus.accepted);
    expect(prisma.product.update).not.toHaveBeenCalled();
    expect(notificationService.sendToUser).toHaveBeenCalledWith(
      mockOrder.buyerId,
      expect.objectContaining({
        body: expect.stringContaining('accepted'),
      }),
    );
  });

  it('should prevent buyer from accepting an order', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.pending,
    });

    await expect(
      service.updateStatus(2, 1, { status: OrderStatus.accepted }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow buyer to pay for an accepted order', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.accepted,
    });
    prisma.order.update.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.paid,
    });

    const result = await service.updateStatus(2, 1, {
      status: OrderStatus.paid,
    });

    expect(result.status).toBe(OrderStatus.paid);
    expect(notificationService.sendToUser).toHaveBeenCalledWith(
      mockOrder.product.sellerId,
      expect.objectContaining({
        body: expect.stringContaining('paid'),
      }),
    );
  });

  it('should prevent paying for an order that is still pending', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.pending,
    });

    await expect(
      service.updateStatus(2, 1, { status: OrderStatus.paid }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should allow seller to ship a paid order (mark delivering)', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.paid,
    });
    prisma.order.update.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.delivering,
    });

    const result = await service.updateStatus(1, 1, {
      status: OrderStatus.delivering,
    });

    expect(result.status).toBe(OrderStatus.delivering);
    expect(notificationService.sendToUser).toHaveBeenCalledWith(
      mockOrder.buyerId,
      expect.objectContaining({
        body: expect.stringContaining('delivering'),
      }),
    );
  });

  it('should allow buyer to confirm delivery (mark sold)', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.delivering,
    });
    prisma.order.update.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.sold,
    });

    const result = await service.updateStatus(2, 1, {
      status: OrderStatus.sold,
    });

    expect(result.status).toBe(OrderStatus.sold);
    expect(notificationService.sendToUser).toHaveBeenCalledWith(
      mockOrder.product.sellerId,
      expect.objectContaining({
        body: expect.stringContaining('sold'),
      }),
    );
  });

  it('should restore product stock when order is cancelled from pending', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.pending,
    });
    prisma.product.update.mockResolvedValue({ id: 10, quantity: 8 });
    prisma.order.update.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.cancelled,
    });
    prisma.$transaction.mockResolvedValue([
      { id: 10, quantity: 8 },
      { ...mockOrder, status: OrderStatus.cancelled },
    ]);

    const result = await service.updateStatus(2, 1, {
      status: OrderStatus.cancelled,
    });

    expect(result.status).toBe(OrderStatus.cancelled);
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: mockOrder.productId },
      data: { quantity: { increment: mockOrder.quantity } },
    });
    expect(notificationService.sendToUser).toHaveBeenCalledWith(
      mockOrder.product.sellerId,
      expect.objectContaining({
        body: expect.stringContaining('cancelled'),
      }),
    );
  });

  it('should not allow cancelling an order once it is paid or delivering', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.paid,
    });

    await expect(
      service.updateStatus(2, 1, { status: OrderStatus.cancelled }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not allow any transition from terminal states sold or cancelled', async () => {
    prisma.order.findUnique.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.sold,
    });

    await expect(
      service.updateStatus(1, 1, { status: OrderStatus.delivering }),
    ).rejects.toThrow(BadRequestException);
  });
});
