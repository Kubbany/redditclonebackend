import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entites/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from '../dtos/create_post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}
  async createPost(
    authorId: number,
    authorName: string,
    createPostDto: CreatePostDTO,
    imageUrl?: string,
  ): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId,
      authorName,
      imageUrl,
    });
    return this.postsRepository.save(post);
  }
}
