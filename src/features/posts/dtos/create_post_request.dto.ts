import { IsString, Length } from 'class-validator';

export class CreatePostRequestDTO {
  @IsString()
  @Length(1, 300)
  title: string;

  @IsString()
  description: string;
}
