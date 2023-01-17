import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './service/auth/firebase-auth.service';
import { FirebaseNotificationService } from './service/notification/notification.service';
import { NotificationModule } from './module/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [FirebaseAuthService],
  exports: [FirebaseAuthService, NotificationModule],
})
export class FirebaseModule {}
