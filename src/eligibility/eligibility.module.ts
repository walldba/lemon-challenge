import { Module } from '@nestjs/common';
import { EligibilityController } from './controllers/eligibility.controller';
import { EligibilityService } from './services/eligibility.service';

@Module({
  controllers: [EligibilityController],
  providers: [EligibilityService]
})
export class EligibilityModule {}
