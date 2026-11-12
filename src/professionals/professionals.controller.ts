import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfessionalsService } from './professionals.service.js';
import { createProfessionalSchema } from './dto/create-professional.dto.js';
import type { CreateProfessionalDto } from './dto/create-professional.dto.js';
import { updateProfessionalSchema } from './dto/update-professional.dto.js';
import type { UpdateProfessionalDto } from './dto/update-professional.dto.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createProfessionalSchema))
    dto: CreateProfessionalDto,
  ) {
    return this.professionalsService.create(dto);
  }

  @Get()
  findAll() {
    return this.professionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.professionalsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProfessionalSchema))
    dto: UpdateProfessionalDto,
  ) {
    return this.professionalsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.professionalsService.remove(id);
  }
}
