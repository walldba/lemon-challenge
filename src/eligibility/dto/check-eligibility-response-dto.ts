export class CheckEligibilityResponseDto {
  elegible: boolean;
  CO2AnnualSavings?: number;
  ineligibilityReasons?: string;
  additionalProperties?: boolean;
}
