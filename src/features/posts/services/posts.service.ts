import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entites/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from '../dtos/create_post_request.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}
  async createPost(
    authorId: number,
    authorName: string,
    createPostDto: CreatePostDTO,
    imageUrl?: string,
  ): Promise<Post> {
    const post = this.postsRepository.create({
      title: createPostDto.title,
      description: createPostDto.description,
      imageUrl,
      authorId,
      authorName,
    });
    return this.postsRepository.save(post);
  }
}
