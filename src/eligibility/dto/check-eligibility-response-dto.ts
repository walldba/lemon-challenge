export class CheckEligibilityResponseDto {
  elegibility: boolean;
  CO2AnnualSavings?: number;
  ineligibilityReasons?: string;
  additionalProperties?: boolean;
}
