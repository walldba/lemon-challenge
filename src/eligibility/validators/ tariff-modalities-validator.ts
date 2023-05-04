import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class TariffModalitiesNotElegibility
  implements ValidatorConstraintInterface
{
  validate(text: string, validationArguments: ValidationArguments) {
    return !validationArguments.constraints.includes(text);
  }
}
