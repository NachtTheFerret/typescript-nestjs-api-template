import { IsNumberString, IsString, Length } from 'class-validator';

export class TwoFactorAuthVerifyDto {
  /** Two-factor authentication code */
  @Length(6, 6)
  @IsNumberString()
  input: string;

  @IsString()
  code: string;
}
