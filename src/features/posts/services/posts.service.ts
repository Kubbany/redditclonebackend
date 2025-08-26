/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entites/post.entity';
import { Repository } from 'typeorm';
import { CreatePostRequestDTO } from '../dtos/create_post_request.dto';
import { GetPostsResponseDTO } from '../dtos/get_posts_response.dto';
import { UpdatePostRequestDTO } from '../dtos/update_post_request.dto';
import { Comment } from 'src/features/comments/entites/comments.entity';
import { ResponseDTO } from 'src/utils/dtos/response.dto';
import { Messages } from 'src/utils/messages.utils';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async createPost(
    authorId: number,
    authorName: string,
    createPostRequestDto: CreatePostRequestDTO,
    file?: Express.Multer.File,
  ): Promise<ResponseDTO> {
    try {
      let uploadedUrl: string | undefined;
      let uploadedPublicId: string | undefined;

      if (file) {
        const res = await this.cloudinaryService.uploadImageFromBuffer(file);
        uploadedUrl = res.secure_url;
        uploadedPublicId = res.public_id;
      }
      const post = this.postsRepository.create({
        title: createPostRequestDto.title,
        description: createPostRequestDto.description,
        imageUrl: uploadedUrl,
        imagePublicId: uploadedPublicId,
        authorId,
        authorName,
      });
      await this.postsRepository.save(post);
      return {
        statusCode: HttpStatus.CREATED,
        message: Messages.POSTS.CREATE_SUCCESS,
      };
    } catch (error) {
      throw new InternalServerErrorException(Messages.POSTS.CREATE_FAILURE);
    }
  }

  async getAllPosts(): Promise<GetPostsResponseDTO[]> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(Messages.POSTS.GET_POSTS_FAILURE);
    }
  }

  async getMyPosts(authorId: number): Promise<GetPostsResponseDTO[]> {
    const posts = await this.getAllPosts();
    return posts.filter((p) => p.authorId === authorId);
  }

  async updatePost(
    postId: number,
    authorId: number,
    updatePostRequestDto: UpdatePostRequestDTO,
  ): Promise<ResponseDTO> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        throw new NotFoundException(Messages.POSTS.POST_NOT_FOUND);
      }
      if (post.authorId !== authorId) {
        throw new ForbiddenException(Messages.POSTS.UPDATE_FORBIDDEN);
      }
      post.title = updatePostRequestDto.title ?? post.title;
      post.description = updatePostRequestDto.description ?? post.description;
      await this.postsRepository.save(post);
      return {
        statusCode: HttpStatus.OK,
        message: Messages.POSTS.UPDATE_SUCCESS,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(Messages.POSTS.UPDATE_FAILURE);
    }
  }

  async deletePost(postId: number, authorId: number): Promise<ResponseDTO> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException(Messages.POSTS.POST_NOT_FOUND);
      }

      if (post.authorId !== authorId) {
        throw new ForbiddenException(Messages.POSTS.DELETE_FORBIDDEN);
      }

      if (post.imagePublicId) {
        await this.cloudinaryService.deleteByPublicId(post.imagePublicId);
      }

      await this.commentsRepository.delete({ postId: postId } as any);
      await this.postsRepository.remove(post);

      return {
        statusCode: HttpStatus.OK,
        message: Messages.POSTS.DELETE_SUCCESS,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(Messages.POSTS.DELETE_FAILURE);
    }
  }
}
