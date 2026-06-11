import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password!: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  @Matches(/^\d{8}$/, { message: 'DNI must be 8 digits' })
  dni?: string;
}
