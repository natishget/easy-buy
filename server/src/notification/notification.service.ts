import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as webpush from 'web-push';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
      throw new InternalServerErrorException('Missing VAPID keys');
    }
     webpush.setVapidDetails(
      'mailto:natishget@gmail.com',
      publicKey,
      privateKey,
    );
  }

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

 
  async save(userId: number, sub: { endpoint: string; keys: { p256dh: string; auth: string } }) {
    console.log("Subscription received:", sub);
    console.log("For user ID:", userId);
    const { endpoint, keys: { p256dh, auth } } = sub;
    try {
      const saved = await this.prisma.pushSubscription.upsert({
        where: { userId },
        update: { endpoint, p256dh, auth },
        create: { userId, endpoint, p256dh, auth },
      });
      return { message: 'Subscription saved successfully', id: saved.id };
    } catch (e: any) {
      if (e.code === 'P2002') {
        return { message: 'Subscription already exists' };
      }
      throw e;
    }
  }

  async sendToUser(userId: number, payload: { title: string; body: string }) {
    // 1️⃣ Save notification in DB
    await this.prisma.notification.create({
      data: {
        userId,
        title: payload.title,
        body: payload.body,
      },
    });

    // 2️⃣ Get all subscriptions for this user
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId },
    });

    // 3️⃣ Send push to each subscription
    const sendPromises = subscriptions.map((sub) => {
      return webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload),
      ).catch(async (err: any) => {
        console.log('Failed to send push, removing subscription', sub.endpoint);
        console.log(err)
        // Remove invalid subscription
        await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
      });
    });

    await Promise.all(sendPromises);
  }



  async findAll() {
    return await this.prisma.pushSubscription.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
