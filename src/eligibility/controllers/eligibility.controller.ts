import { Body, Controller, Post } from '@nestjs/common';
import { EligibilityService } from '../services/eligibility.service';
import { CheckEligibilityRequestDto } from '../dto/check-eligibility-request-dto';

@Controller('eligibility')
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Post()
  async checkEligibility(
    @Body() checkEligibilityRequestDto: CheckEligibilityRequestDto,
  ) {
    return this.eligibilityService.check(checkEligibilityRequestDto);
  }
}
