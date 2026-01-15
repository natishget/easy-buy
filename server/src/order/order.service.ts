import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private notificationService: NotificationService) { }
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
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          }
        },
        quantity: true,
      }
    });

    if (!orders) {
      throw new NotFoundException("No order is Found");
    }
    return orders
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
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          }
        },
        quantity: true,
      }
    })

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return order
  }

  //find orders of a buyer
  async findByBuyerId(id: number) {
    const order = await this.prisma.order.findMany({
      where: { buyerId: id },
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
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          }
        },
        quantity: true,
        createdAt: true,
        status: true,
      }
    })

    if (!order) {
      throw new NotFoundException("User don't have order yet")
    }

    return order
  }

  ///find orders of a seller
  async findBySellerId(id: number) {
    const order = await this.prisma.order.findMany({
      where: {
        product: {
          seller: {
            id: id
          }
        }
      },
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
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            isSeller: true,
          }
        },
        quantity: true,
        status: true,
        createdAt: true,
      }
    })

    if (!order) {
      throw new NotFoundException("User don't have order yet")
    }

    return order
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: { id },
      data: {
        quantity: updateOrderDto.quantity,
        totalPrice: updateOrderDto.totalPrice,
      }
    })
  }

  // change order status
  async updateStatus(userId:number, id: number,  updateOrderStatusDto: UpdateOrderDto) {
    let orderInfo = (await this.prisma.order.findUnique({
      where: { id },
      select: { productId: true, quantity: true, buyerId: true}
    }));

    const productId = orderInfo?.productId;
    const orderQuantity = orderInfo?.quantity;
    const buyerId = orderInfo?.buyerId;

    let productInfo = (await this.prisma.product.findUnique({
      where: { id: productId! },
      select: { quantity: true, sellerId: true }
    }));
    if(updateOrderStatusDto.status === "accepted"){
      

      const productQuantity = productInfo?.quantity;

      if(!productQuantity || !orderQuantity || productQuantity - orderQuantity < 0){
        throw new ConflictException("Insufficient product quantity to accept the order");
      }
      
        const product = await this.prisma.product.update({
          where: { id: productId },
          data: { quantity: productQuantity - orderQuantity! }
        });
    
      }
      const updateRespose =  await this.prisma.order.update({
        where: { id },
        data: {
          status: updateOrderStatusDto.status
        }
      });

      const notificationReciepientId = updateOrderStatusDto.status === 'accepted' || updateOrderStatusDto.status === 'delivering'  ?  orderInfo?.buyerId : productInfo?.sellerId;

      await this.notificationService.sendToUser(notificationReciepientId!, {
        title: 'Order Update',
        body: `Your order #${id} status has changed to ${updateOrderStatusDto.status}!`,
      });
      return updateRespose;
}

  // cancel order only used by admins
  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id }
    })
    if (!order)
      throw new NotFoundException("Order not Found")
    const orderStatus = order?.status === 'pending'
    if (!orderStatus) {
      throw new ConflictException("Order can't be cancelled now")
    }
    return await this.prisma.order.delete({
      where: { id },
    })
  }

}
