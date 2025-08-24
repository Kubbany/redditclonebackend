import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/features/posts/entites/post.entity';
import { Repository } from 'typeorm';
import { CreateCommentResponseDTO } from '../dtos/create_comment_response.dto';
import { CreateCommentRequestDTO } from '../dtos/create_comment_request.dto';
import { Comment } from '../entites/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async createComment(
    authorId: number,
    authorName: string,
    createCommentRequestDto: CreateCommentRequestDTO,
  ): Promise<CreateCommentResponseDTO> {
    const post = await this.postsRepository.findOne({
      where: { id: createCommentRequestDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    const comment = this.commentsRepository.create({
      comment: createCommentRequestDto.comment,
      postId: createCommentRequestDto.postId,
      authorId,
      authorName,
    });
    const createdComment = await this.commentsRepository.save(comment);

    return {
      id: createdComment.id,
      comment: createdComment.comment,
      authorId: createdComment.authorId,
      authorName: createdComment.authorName,
      postId: createdComment.postId,
      createdAt: createdComment.createdAt,
    };
  }
}
