import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entites/post.entity';
import { Repository } from 'typeorm';
import { CreatePostRequestDTO } from '../dtos/create_post_request.dto';
import { CreatePostResponseDTO } from '../dtos/create_post_response.dto';
import { GetPostsResponseDTO } from '../dtos/get_posts_request.dto';
import { UpdatePostRequestDTO } from '../dtos/update_post_request.dto';
import { UpdatePostResponseDTO } from '../dtos/update_post_response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}
  async createPost(
    authorId: number,
    authorName: string,
    createPostRequestDto: CreatePostRequestDTO,
  ): Promise<CreatePostResponseDTO> {
    const post = this.postsRepository.create({
      title: createPostRequestDto.title,
      description: createPostRequestDto.description,
      imageUrl: createPostRequestDto.imageUrl,
      authorId,
      authorName,
    });
    const savedPost = await this.postsRepository.save(post);

    return {
      id: savedPost.id,
      title: savedPost.title,
      description: savedPost.description,
      imageUrl: savedPost.imageUrl,
      authorId: savedPost.authorId,
      authorName: savedPost.authorName,
      createdAt: savedPost.createdAt,
    };
  }

  async getAllPosts(): Promise<GetPostsResponseDTO[]> {
    const posts = await this.postsRepository.find({
      order: { createdAt: 'DESC' },
    });
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      authorId: post.authorId,
      authorName: post.authorName,
    }));
  }

  async getPostById(id: number): Promise<GetPostsResponseDTO> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      authorId: post.authorId,
      authorName: post.authorName,
    };
  }

  async updatePost(
    postId: number,
    authorId: number,
    updatePostRequestDto: UpdatePostRequestDTO,
  ): Promise<UpdatePostResponseDTO> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    if (post.authorId !== authorId) {
      throw new ForbiddenException("You Can't Update This Post");
    }
    post.title = updatePostRequestDto.title ?? post.title;
    post.description = updatePostRequestDto.description ?? post.description;
    const updatedPost = await this.postsRepository.save(post);
    return {
      id: updatedPost.id,
      title: updatedPost.title,
      description: updatedPost.description,
      imageUrl: updatedPost.imageUrl,
      authorId: updatedPost.authorId,
      authorName: updatedPost.authorName,
    };
  }
}
