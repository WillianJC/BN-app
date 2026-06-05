import { IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;
}
