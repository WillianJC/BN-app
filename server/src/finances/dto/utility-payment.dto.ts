import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export enum UtilityType {
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
}

export class UtilityPaymentDto {
  @IsEnum(UtilityType)
  utilityType!: UtilityType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @IsString()
  invoiceNumber!: string;
}
