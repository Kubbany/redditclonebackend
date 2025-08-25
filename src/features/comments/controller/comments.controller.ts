import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from '../service/comments.service';
import { CurrentUser } from 'src/features/auth/decorators/get_current_user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentRequestDTO } from '../dtos/create_comment_request.dto';
import { CreateCommentResponseDTO } from '../dtos/create_comment_response.dto';
import { GetCommentResponseDTO } from '../dtos/get_comments_response.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createComment(
    @CurrentUser('name') authorName: string,
    @Body() createCommentRequestDto: CreateCommentRequestDTO,
  ): Promise<CreateCommentResponseDTO> {
    return this.commentsService.createComment(
      authorName,
      createCommentRequestDto,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('post/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: number,
  ): Promise<GetCommentResponseDTO[]> {
    return await this.commentsService.getCommentsByPostId(postId);
  }
}
