export class CreatePostResponseDTO {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  authorId: number;
  authorName: string;
  createdAt: Date;
}
