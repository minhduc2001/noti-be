import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Firebase } from '../entities/firebase.entity';
import { FirebaseNotificationService } from '../service/notification/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Firebase])],
  providers: [FirebaseNotificationService],
  exports: [FirebaseNotificationService],
})
export class NotificationModule {}
