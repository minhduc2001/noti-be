import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase';
import { UserModule } from './user/user.module';

@Module({
  imports: [FirebaseModule, 
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 6666,
    username: 'minhduc',
    password: '462001',
    database: 'notify',
    entities: ['dist/**/*.{js, ts}'],
    synchronize: true,
  }), UserModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
