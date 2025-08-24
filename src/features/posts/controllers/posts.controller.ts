import {
  Body,
  Controller,
  UseGuards,
  Post as HttpPost,
  Get,
  Param,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostRequestDTO } from '../dtos/create_post_request.dto';
import { CurrentUser } from 'src/features/auth/decorators/get_current_user.decorator';
import { CreatePostResponseDTO } from '../dtos/create_post_response.dto';
import { GetPostsResponseDTO } from '../dtos/get_posts_request.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  async createPost(
    @CurrentUser('sub') authorId: number,
    @CurrentUser('name') authorName: string,
    @Body() dto: CreatePostRequestDTO,
  ): Promise<CreatePostResponseDTO> {
    return await this.postsService.createPost(authorId, authorName, dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllPosts(): Promise<GetPostsResponseDTO[]> {
    return await this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: number): Promise<GetPostsResponseDTO> {
    return await this.postsService.getPostById(id);
  }
}
