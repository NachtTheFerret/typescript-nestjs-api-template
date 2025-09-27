import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  offset?: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number;
}
