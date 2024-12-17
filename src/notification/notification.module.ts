import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Module({
  controllers: [NotificationController],
  imports: [TypeOrmModule.forFeature([Notification])], // This makes NotificationRepository available
  providers: [NotificationService],
  exports: [NotificationService],  
})
export class NotificationModule {}
