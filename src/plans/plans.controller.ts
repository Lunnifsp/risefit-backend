import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlansService } from './plans.service.js';
import { createPlanSchema } from './dto/create-plan.dto.js';
import type { CreatePlanDto } from './dto/create-plan.dto.js';
import { updatePlanSchema } from './dto/update-plan.dto.js';
import type { UpdatePlanDto } from './dto/update-plan.dto.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createPlanSchema)) dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePlanSchema)) dto: UpdatePlanDto,
  ) {
    return this.plansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}