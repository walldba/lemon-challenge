import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class ConsumptionClassesNotElegibility
  implements ValidatorConstraintInterface
{
  validate(text: string, validationArguments: ValidationArguments) {
    return !validationArguments.constraints.includes(text);
  }
}
