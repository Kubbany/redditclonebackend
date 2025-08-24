/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Req,
  UseGuards,
  Post as HttpPost,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDTO } from '../dtos/create_post_request.dto';
import { Post } from '../entites/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  async createPost(
    @Body() createPostDto: CreatePostDTO,
    @Req() req,
  ): Promise<Post> {
    return this.postService.createPost(
      req.user.id,
      req.user.name,
      createPostDto,
    );
  }
}
