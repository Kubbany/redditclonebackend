import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePostRequestDTO {
  @IsString()
  @Length(1, 300)
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
