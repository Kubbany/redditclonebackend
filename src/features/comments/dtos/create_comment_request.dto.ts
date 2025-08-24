import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCommentRequestDTO {
  @IsNotEmpty()
  comment: string;

  @IsInt()
  postId: number;
}
