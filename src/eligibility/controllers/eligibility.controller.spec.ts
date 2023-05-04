import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from '../services/eligibility.service';
import { CheckEligibilityRequestDto } from '../dto/check-eligibility-request-dto';
import { IneligibilityMessageEnum } from '../enums/inelegible-message-enum';
import { TariffModalitiesEnum } from '../enums/ tariff-modalities-enum';
import { ConnectionTypeEnum } from '../enums/connection-type-enum';
import { ConsumptionClassesEnum } from '../enums/consumption-classes-enum';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe('EligibilityController', () => {
  let controller: EligibilityController;
  let service: EligibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EligibilityController],
      providers: [EligibilityService],
    }).compile();

    controller = module.get<EligibilityController>(EligibilityController);
    service = module.get<EligibilityService>(EligibilityService);
  });

  describe('checkEligibility', () => {
    it('should return eligible for a valid request', async () => {
      const request: CheckEligibilityRequestDto = {
        documentNumber: '12345678901',
        connectionType: ConnectionTypeEnum.TRIFASICO,
        consumpitionClasses: ConsumptionClassesEnum.RESIDENCIAL,
        tariffModalities: TariffModalitiesEnum.BRANCA,
        consumptionHistory: [3878, 9760, 5976],
        additionalProperties: 'some additional properties',
      };

      jest.spyOn(service, 'check').mockImplementation(() => {
        return {
          elegible: true,
          CO2AnnualSavings: 6590,
        };
      });

      const result = await controller.checkEligibility(request);

      expect(result.elegible).toEqual(true);
      expect(result.CO2AnnualSavings).toEqual(6590);
    });

    it('should return not eligible with a proper message for an invalid document', async () => {
      const request: CheckEligibilityRequestDto = {
        documentNumber: '1234567890101112',
        connectionType: ConnectionTypeEnum.TRIFASICO,
        consumpitionClasses: ConsumptionClassesEnum.RESIDENCIAL,
        tariffModalities: TariffModalitiesEnum.BRANCA,
        consumptionHistory: [150, 200, 250],
        additionalProperties: 'some additional properties',
      };

      const validationErrors = await validate(
        plainToClass(CheckEligibilityRequestDto, request),
      );

      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0].constraints).toHaveProperty('matches');
      expect(validationErrors[0].constraints.matches).toBe(
        IneligibilityMessageEnum.INVALID_DOCUMENT,
      );
    });

    it('should return not eligible with a proper message for an ineligible consumption class and inelegible tariff', async () => {
      const request: CheckEligibilityRequestDto = {
        documentNumber: '12345678901',
        connectionType: ConnectionTypeEnum.TRIFASICO,
        consumpitionClasses: ConsumptionClassesEnum.RURAL,
        tariffModalities: TariffModalitiesEnum.VERDE,
        consumptionHistory: [150, 200, 250],
        additionalProperties: 'some additional properties',
      };

      const validationErrors = await validate(
        plainToClass(CheckEligibilityRequestDto, request),
      );

      expect(validationErrors).toHaveLength(2);
    });
  });
});
