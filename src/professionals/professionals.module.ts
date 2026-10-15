import { Module } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service.js';
import { ProfessionalsController } from './professionals.controller.js';

@Module({
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
})
export class ProfessionalsModule {}
