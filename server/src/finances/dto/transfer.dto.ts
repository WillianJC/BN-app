import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class TransferDto {
  @IsUUID()
  recipientId!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @IsString()
  description!: string;
}
