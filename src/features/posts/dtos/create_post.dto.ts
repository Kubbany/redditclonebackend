import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 300)
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
