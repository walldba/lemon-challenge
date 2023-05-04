import { EligibilityService } from './eligibility.service';
import { CheckEligibilityRequestDto } from '../dto/check-eligibility-request-dto';
import { ConnectionTypeEnum } from '../enums/connection-type-enum';
import { IneligibilityMessageEnum } from '../enums/inelegible-message-enum';
import { TariffModalitiesEnum } from '../enums/ tariff-modalities-enum';
import { ConsumptionClassesEnum } from '../enums/consumption-classes-enum';

describe('EligibilityService', () => {
  let service: EligibilityService;

  beforeEach(() => {
    service = new EligibilityService();
  });

  describe('check', () => {
    it('should return eligible with CO2 savings for a valid request', () => {
      const request: CheckEligibilityRequestDto = {
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.BIFASICO,
        consumpitionClasses: ConsumptionClassesEnum.COMERCIAL,
        tariffModalities: TariffModalitiesEnum.CONVENCIONAL,
        consumptionHistory: [3878, 9760, 5976],
        additionalProperties: 'some additional properties',
      };

      const result = service.check(request);

      expect(result.elegible).toEqual(true);
      expect(result.CO2AnnualSavings).toEqual(6590);
      expect(result.ineligibilityReasons).toEqual(undefined);
    });

    it('should return not eligible with a proper message for a request with an invalid average consumption', () => {
      const request: CheckEligibilityRequestDto = {
        documentNumber: '12345678901',
        connectionType: ConnectionTypeEnum.TRIFASICO,
        consumpitionClasses: ConsumptionClassesEnum.RESIDENCIAL,
        tariffModalities: TariffModalitiesEnum.BRANCA,
        consumptionHistory: [10, 20, 30],
        additionalProperties: 'some additional properties',
      };

      const result = service.check(request);

      expect(result.elegible).toEqual(false);
      expect(result.CO2AnnualSavings).toEqual(undefined);
      expect(result.ineligibilityReasons).toEqual(
        IneligibilityMessageEnum.AVERAGE_CONSUMPTION,
      );
    });
  });

  describe('calculateAnnualSavings', () => {
    it('should calculate the annual CO2 savings based on historical consumption', () => {
      const result = service['calculateAnnualSavings']([150, 200, 250]);

      expect(result).toEqual(202);
    });
  });

  describe('checkEligibility', () => {
    it('should return true for a TRIFASICO connection type and sufficient CO2 savings', () => {
      const result = service['checkEligibility'](
        ConnectionTypeEnum.TRIFASICO,
        800,
      );

      expect(result).toBe(true);
    });

    it('should return false for a TRIFASICO connection type and insufficient CO2 savings', () => {
      const result = service['checkEligibility'](
        ConnectionTypeEnum.TRIFASICO,
        500,
      );

      expect(result).toBe(false);
    });

    it('should return true for a BIFASICO connection type and sufficient CO2 savings', () => {
      const result = service['checkEligibility'](
        ConnectionTypeEnum.BIFASICO,
        600,
      );

      expect(result).toBe(true);
    });

    it('should return false for a BIFASICO connection type and insufficient CO2 savings', () => {
      const result = service['checkEligibility'](
        ConnectionTypeEnum.BIFASICO,
        400,
      );

      expect(result).toBe(false);
    });
  });
});
