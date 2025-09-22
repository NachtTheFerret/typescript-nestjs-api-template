import { IsLowercase, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsLowercase()
  username: string;

  @IsNotEmpty()
  password: string;
}
