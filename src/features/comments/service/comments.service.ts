import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/features/posts/entites/post.entity';
import { Repository } from 'typeorm';
import { CreateCommentResponseDTO } from '../dtos/create_comment_response.dto';
import { CreateCommentRequestDTO } from '../dtos/create_comment_request.dto';
import { Comment } from '../entites/comments.entity';
import { GetCommentResponseDTO } from '../dtos/get_comments_response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async createComment(
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
      authorName,
    });
    await this.commentsRepository.save(comment);
    return {
      success: 'Success',
    };
  }

  async getCommentsByPostId(postId: number): Promise<GetCommentResponseDTO[]> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    const comments = await this.commentsRepository.find({
      where: { postId },
      order: { createdAt: 'DESC' },
    });

    return comments.map((comment) => ({
      id: comment.id,
      comment: comment.comment,
      authorName: comment.authorName,
    }));
  }
}
