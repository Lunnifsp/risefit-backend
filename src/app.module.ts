import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PlansModule } from './plans/plans.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfessionalsModule } from './professionals/professionals.module.js';
import { ExercisesModule } from './exercises/exercises.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { SubscriptionsModule } from './subscriptions/subscriptions.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY || 'dev_app_key',
      appSecret: process.env.OBSERVE_APP_SECRET || 'dev_app_secret',
      serviceId: process.env.OBSERVE_SERVICE_ID || 'risefit-backend',
    }),
    PrismaModule,
    UsersModule,
    PlansModule,
    SubscriptionsModule,
    ProfessionalsModule,
    ExercisesModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
