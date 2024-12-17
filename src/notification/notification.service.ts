import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}
  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find(); 
  }
  async createNotification(type: string, message: string): Promise<Notification> {
    const notification = this.notificationRepository.create({
      type: type,     
      message: message, 
      timestamp: new Date(),
    });

    return this.notificationRepository.save(notification); 
  }
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
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
