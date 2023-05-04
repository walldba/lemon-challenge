import { Injectable } from '@nestjs/common';
import { CheckEligibilityRequestDto } from '../dto/check-eligibility-request-dto';
import { CheckEligibilityResponseDto } from '../dto/check-eligibility-response-dto';
import { ConnectionTypeEnum } from '../enums/connection-type-enum';
import { IneligibilityMessageEnum } from '../enums/inelegible-message-enum';

@Injectable()
export class EligibilityService {
  private readonly CO2_EMISSIONS_PER_KWH = 84;
  private readonly MONOFASICO_MINIMUM_CONSUMPTION = 400;
  private readonly BIFASICO_MINIMUM_CONSUMPTION = 500;
  private readonly TRIFASICO_MINIMUM_CONSUMPTION = 750;

  public check(
    checkEligibilityRequestDto: CheckEligibilityRequestDto,
  ): CheckEligibilityResponseDto {
    const kgCO2Saved = this.calculateAnnualSavings(
      checkEligibilityRequestDto.consumptionHistory,
    );

    const isElibilible = this.checkEligibility(
      checkEligibilityRequestDto.connectionType,
      kgCO2Saved,
    );

    return {
      elegibility: isElibilible,
      CO2AnnualSavings: isElibilible ? kgCO2Saved : undefined,
      ineligibilityReasons: isElibilible
        ? undefined
        : IneligibilityMessageEnum.AVERAGE_CONSUMPTION,
    };
  }

  private calculateAnnualSavings(historicalConsumption: number[]): number {
    const averageConsumption =
      historicalConsumption.reduce((a, b) => a + b, 0) /
      historicalConsumption.length;

    const annualConsumption = averageConsumption * 12;
    const kgCO2Saved = (annualConsumption * this.CO2_EMISSIONS_PER_KWH) / 1000;

    return Number(kgCO2Saved.toFixed());
  }

  private checkEligibility(
    connectionTypeEnum: ConnectionTypeEnum,
    kgCO2Saved: number,
  ): boolean {
    switch (connectionTypeEnum) {
      case ConnectionTypeEnum.MONOFASICO:
        return kgCO2Saved > this.MONOFASICO_MINIMUM_CONSUMPTION;

      case ConnectionTypeEnum.BIFASICO:
        return kgCO2Saved > this.BIFASICO_MINIMUM_CONSUMPTION;

      case ConnectionTypeEnum.TRIFASICO:
        return kgCO2Saved > this.TRIFASICO_MINIMUM_CONSUMPTION;
    }
  }
}
