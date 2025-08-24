export class CreateCommentResponseDTO {
  id: number;
  text: string;
  authorId: number;
  authorName: string;
  postId: number;
  createdAt: Date;
}
