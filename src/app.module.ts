import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dirname } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { EventModule } from './event/event.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'root',
    password:'',
    database:'dmwm_db',
    entities:[ __dirname + '/**/*.entity{.ts,.js}',__dirname + '/**/*.entity{.ts,.js}'] ,
    synchronize: true
  }), UserModule, AuthModule, EventModule],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
})
export class AppModule {}
