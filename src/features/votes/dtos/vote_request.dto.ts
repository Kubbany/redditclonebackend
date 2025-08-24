import { IsInt, IsIn } from 'class-validator';

export class VoteRequestDTO {
  @IsInt()
  postId: number;

  @IsIn([1, -1])
  value: number;
}
