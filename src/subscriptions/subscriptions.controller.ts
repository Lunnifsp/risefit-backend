import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service.js';
import { createSubscriptionSchema } from './dto/create-subscription.dto.js';
import type { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
import { updateSubscriptionSchema } from './dto/update-subscription.dto.js';
import type { UpdateSubscriptionDto } from './dto/update-subscription.dto.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createSubscriptionSchema))
    dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(dto);
  }

  @Get()
  findAll(
    @Query('usuarioId', new ParseIntPipe({ optional: true }))
    usuarioId?: number,
    @Query('status') status?: string,
  ) {
    return this.subscriptionsService.findAll({ usuarioId, status });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateSubscriptionSchema))
    dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.remove(id);
  }
}
