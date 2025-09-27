import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*[a-z0-9]$/, {
    message:
      'Username must start with a lowercase letter, can contain lowercase letters, numbers, underscores, and cannot start with an underscore, end with an underscore, or have consecutive underscores',
  })
  @Matches(/^(?!.*__)/, { message: 'Username cannot contain consecutive underscores' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(32, { message: 'Username cannot be longer than 32 characters' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(64, { message: 'Password cannot be longer than 64 characters' })
  password: string;
}
