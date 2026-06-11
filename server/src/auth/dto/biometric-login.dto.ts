import { IsString, Length, Matches } from 'class-validator';

export class BiometricLoginDto {
  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/, { message: 'DNI must be 8 digits' })
  dni!: string;
}
