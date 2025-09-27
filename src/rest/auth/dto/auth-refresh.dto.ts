import { IsJWT, IsString } from 'class-validator';

export class AuthRefreshDto {
  @IsString()
  @IsJWT()
  refresh_token: string;
}
