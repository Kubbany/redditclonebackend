import {
  Body,
  Controller,
  UseGuards,
  Post as HttpPost,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostRequestDTO } from '../dtos/create_post_request.dto';
import { CurrentUser } from 'src/features/auth/decorators/get_current_user.decorator';
import { GetPostsResponseDTO } from '../dtos/get_posts_response.dto';
import { UpdatePostRequestDTO } from '../dtos/update_post_request.dto';
import { ResponseDTO } from 'src/utils/dtos/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @CurrentUser('sub') authorId: number,
    @CurrentUser('name') authorName: string,
    @Body() dto: CreatePostRequestDTO,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    return await this.postsService.createPost(authorId, authorName, dto, file);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllPosts(): Promise<GetPostsResponseDTO[]> {
    return await this.postsService.getAllPosts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-posts')
  async getMyPosts(
    @CurrentUser('sub') authorId: number,
  ): Promise<GetPostsResponseDTO[]> {
    return await this.postsService.getMyPosts(authorId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updatePost(
    @Param('id') postId: number,
    @CurrentUser('sub') authorId: number,
    @Body() updateDto: UpdatePostRequestDTO,
  ): Promise<ResponseDTO> {
    return this.postsService.updatePost(postId, authorId, updateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deletePost(
    @Param('id') postId: number,
    @CurrentUser('sub') authorId: number,
  ): Promise<ResponseDTO> {
    return this.postsService.deletePost(postId, authorId);
  }
}
