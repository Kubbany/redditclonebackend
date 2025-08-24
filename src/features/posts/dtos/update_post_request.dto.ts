import { IsOptional, IsString } from 'class-validator';

export class UpdatePostRequestDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
