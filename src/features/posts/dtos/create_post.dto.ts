import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  @Length(1, 300)
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
