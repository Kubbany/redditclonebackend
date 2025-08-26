import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/features/posts/entites/post.entity';
import { Repository } from 'typeorm';
import { CreateCommentRequestDTO } from '../dtos/create_comment_request.dto';
import { Comment } from '../entites/comments.entity';
import { GetCommentResponseDTO } from '../dtos/get_comments_response.dto';
import { ResponseDTO } from 'src/utils/dtos/response.dto';
import { Messages } from 'src/utils/messages.utils';

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
  ): Promise<ResponseDTO> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: createCommentRequestDto.postId },
      });
      if (!post) {
        throw new NotFoundException(Messages.POSTS.POST_NOT_FOUND);
      }
      const comment = this.commentsRepository.create({
        comment: createCommentRequestDto.comment,
        postId: createCommentRequestDto.postId,
        authorName,
      });
      await this.commentsRepository.save(comment);
      return {
        statusCode: HttpStatus.CREATED,
        message: Messages.COMMENTS.CREATE_SUCCESS,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(Messages.COMMENTS.CREATE_FAILURE);
    }
  }

  async getCommentsByPostId(postId: number): Promise<GetCommentResponseDTO[]> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        throw new NotFoundException(Messages.POSTS.POST_NOT_FOUND);
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        Messages.COMMENTS.GET_COMMENTS_FAILURE,
      );
    }
  }
}
