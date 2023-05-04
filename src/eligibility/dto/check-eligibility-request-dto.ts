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
import { TariffModalitiesNotElegibility } from '../validators/ tariff-modalities-validator';
import { ConsumptionClassesNotElegibility } from '../validators/consumption-classes-validator';

export class CheckEligibilityRequestDto {
  @IsString()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: 'Document number must have 11 or 14 characters',
  })
  documentNumber: string;

  @IsEnum(ConnectionTypeEnum)
  connectionType: ConnectionTypeEnum;

  @IsEnum(ConsumptionClassesEnum)
  @Validate(
    ConsumptionClassesNotElegibility,
    [ConsumptionClassesEnum.RURAL, ConsumptionClassesEnum.PODERPUBLICO],
    {
      message: 'Consumption class not accepted',
    },
  )
  consumpitionClasses: ConsumptionClassesEnum;

  @IsEnum(TariffModalitiesEnum)
  @Validate(
    TariffModalitiesNotElegibility,
    [TariffModalitiesEnum.VERDE, TariffModalitiesEnum.AZUL],
    {
      message: 'Tariff modality not accepted',
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
