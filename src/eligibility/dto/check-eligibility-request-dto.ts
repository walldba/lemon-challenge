import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { TariffModalitiesEnum } from '../enums/ tariff-modalities-enum';
import { ConnectionTypeEnum } from '../enums/connection-type-enum';
import { ConsumptionClassesEnum } from '../enums/consumption-classes-enum';
import { IneligibilityMessageEnum } from '../enums/inelegible-message-enum';
import { TariffModalitiesNotElegibility } from '../validators/ tariff-modalities-validator';
import { ConsumptionClassesNotElegibility } from '../validators/consumption-classes-validator';

export class CheckEligibilityRequestDto {
  @IsString()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: IneligibilityMessageEnum.INVALID_DOCUMENT,
  })
  documentNumber: string;

  @IsEnum(ConnectionTypeEnum)
  connectionType: ConnectionTypeEnum;

  @IsEnum(ConsumptionClassesEnum)
  @Validate(
    ConsumptionClassesNotElegibility,
    [ConsumptionClassesEnum.RURAL, ConsumptionClassesEnum.PODERPUBLICO],
    {
      message: IneligibilityMessageEnum.CONSUMPTION_CLASSES_NOT_ELEGIBILITY,
    },
  )
  consumpitionClasses: ConsumptionClassesEnum;

  @IsEnum(TariffModalitiesEnum)
  @Validate(
    TariffModalitiesNotElegibility,
    [TariffModalitiesEnum.VERDE, TariffModalitiesEnum.AZUL],
    {
      message: IneligibilityMessageEnum.TARIFF_MODALITIES_NOT_ELEGIBILITY,
    },
  )
  tariffModalities: TariffModalitiesEnum;

  @ArrayMinSize(3)
  @ArrayMaxSize(12)
  @Min(0, { each: true })
  @Max(9999, { each: true })
  consumptionHistory: number[];

  @IsOptional()
  @IsString()
  additionalProperties: string;
}
