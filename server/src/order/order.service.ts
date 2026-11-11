import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, OrderStatus } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(createOrderDto: CreateOrderDto[], buyerId: number) {
    if (!Array.isArray(createOrderDto) || createOrderDto.length === 0) {
      throw new BadRequestException('No order items provided');
    }

    const ops = createOrderDto.flatMap((item) => {
      if (item.productQuantity < item.quantity) {
        throw new BadRequestException('Insufficient product quantity');
      }
      return [
        this.prisma.product.update({
          where: { id: item.productId },
          data: { quantity: item.productQuantity - item.quantity },
        }),
        this.prisma.order.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            buyerId: Number(buyerId),
          },
        }),
      ];
    });

    return this.prisma.$transaction(ops);
  }

  // get all orders
  async findAll() {
    const orders = await this.prisma.order.findMany({
      select: {
        id: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isSeller: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          },
        },
        quantity: true,
        createdAt: true,
        status: true,
      },
    });

    if (!orders) {
      throw new NotFoundException('No order is Found');
    }
    return orders;
  }

  // get a single order
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isSeller: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          },
        },
        quantity: true,
        createdAt: true,
        status: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // find orders of a buyer
  async findByBuyerId(id: number) {
    const orders = await this.prisma.order.findMany({
      where: { buyerId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isSeller: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          },
        },
        quantity: true,
        createdAt: true,
        status: true,
      },
    });

    return orders;
  }

  // find orders of a seller
  async findBySellerId(id: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        product: {
          sellerId: id,
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isSeller: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          },
        },
        quantity: true,
        status: true,
        createdAt: true,
      },
    });

    return orders;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: { id },
      data: {
        quantity: updateOrderDto.quantity,
        totalPrice: updateOrderDto.totalPrice,
      },
    });
  }

  // change order status with state machine validation, role authorization, stock management, and safe notifications
  async updateStatus(
    userId: number,
    id: number,
    updateOrderStatusDto: UpdateOrderDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                isSeller: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    const isBuyer = order.buyerId === userId;
    const isSeller = order.product.sellerId === userId;

    if (!isBuyer && !isSeller) {
      throw new ForbiddenException(
        'You are not authorized to update this order',
      );
    }

    const currentStatus = order.status;
    const newStatus = updateOrderStatusDto.status;

    if (currentStatus === newStatus) {
      return order;
    }

    if (
      currentStatus === OrderStatus.sold ||
      currentStatus === OrderStatus.cancelled
    ) {
      throw new BadRequestException(
        `Cannot change status of an order that is already ${currentStatus}`,
      );
    }

    // State machine & role-based validation
    switch (newStatus) {
      case OrderStatus.accepted:
        if (!isSeller) {
          throw new ForbiddenException('Only the seller can accept this order');
        }
        if (currentStatus !== OrderStatus.pending) {
          throw new BadRequestException(
            `Order can only be accepted when it is pending (current: ${currentStatus})`,
          );
        }
        break;

      case OrderStatus.paid:
        if (!isBuyer) {
          throw new ForbiddenException(
            'Only the buyer can make payment for this order',
          );
        }
        if (currentStatus !== OrderStatus.accepted) {
          throw new BadRequestException(
            `Order can only be paid after it has been accepted by the seller (current: ${currentStatus})`,
          );
        }
        break;

      case OrderStatus.delivering:
        if (!isSeller) {
          throw new ForbiddenException(
            'Only the seller can mark this order as delivering',
          );
        }
        if (currentStatus !== OrderStatus.paid) {
          throw new BadRequestException(
            `Order can only be shipped after payment has been received (current: ${currentStatus})`,
          );
        }
        break;

      case OrderStatus.sold:
        if (!isBuyer) {
          throw new ForbiddenException(
            'Only the buyer can confirm delivery of this order',
          );
        }
        if (currentStatus !== OrderStatus.delivering) {
          throw new BadRequestException(
            `Delivery can only be confirmed when the order is out for delivery (current: ${currentStatus})`,
          );
        }
        break;

      case OrderStatus.cancelled:
        if (
          currentStatus !== OrderStatus.pending &&
          currentStatus !== OrderStatus.accepted
        ) {
          throw new BadRequestException(
            `Orders can only be cancelled while pending or accepted (current: ${currentStatus})`,
          );
        }
        break;

      default:
        throw new BadRequestException(
          `Invalid status transition from ${currentStatus} to ${newStatus}`,
        );
    }

    const orderInclude = {
      product: {
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              isSeller: true,
            },
          },
        },
      },
      buyer: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          isSeller: true,
        },
      },
    };

    let updatedOrder;

    if (newStatus === OrderStatus.cancelled) {
      // Stock was decremented at checkout; restore stock when order is cancelled
      const [, result] = await this.prisma.$transaction([
        this.prisma.product.update({
          where: { id: order.productId },
          data: {
            quantity: { increment: order.quantity },
          },
        }),
        this.prisma.order.update({
          where: { id },
          data: { status: newStatus },
          include: orderInclude,
        }),
      ]);
      updatedOrder = result;
    } else {
      updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: newStatus },
        include: orderInclude,
      });
    }

    // Send push notification to the opposite party
    const notificationRecipientId = isSeller
      ? order.buyerId
      : order.product.sellerId;

    try {
      await this.notificationService.sendToUser(notificationRecipientId, {
        title: 'Order Update',
        body: `Your order #${id} status has changed to ${newStatus}!`,
      });
    } catch (notifErr) {
      console.error(`Failed to send notification for order #${id}:`, notifErr);
    }

    return updatedOrder;
  }

  // cancel order only used by admins
  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not Found');
    }
    const orderStatus = order?.status === 'pending';
    if (!orderStatus) {
      throw new ConflictException("Order can't be cancelled now");
    }

    const [, deleted] = await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id: order.productId },
        data: { quantity: { increment: order.quantity } },
      }),
      this.prisma.order.delete({
        where: { id },
      }),
    ]);

    return deleted;
  }
}
