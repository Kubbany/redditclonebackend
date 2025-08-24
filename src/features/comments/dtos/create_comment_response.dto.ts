export class CreateCommentResponseDTO {
  id: number;
  comment: string;
  authorId: number;
  authorName: string;
  postId: number;
  createdAt: Date;
}
