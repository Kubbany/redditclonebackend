import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from '../entites/votes.entity';
import { Post } from 'src/features/posts/entites/post.entity';
import { VoteRequestDTO } from '../dtos/vote_request.dto';
import { Repository } from 'typeorm';
import { ResponseDTO } from 'src/utils/dtos/response.dto';
import { Messages } from 'src/utils/messages.utils';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote) private readonly votesRepository: Repository<Vote>,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async votePost(
    userId: number,
    voteRequestDto: VoteRequestDTO,
  ): Promise<ResponseDTO> {
    try {
      const { postId, value } = voteRequestDto;
      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        throw new NotFoundException(Messages.POSTS.POST_NOT_FOUND);
      }
      const existingVote = await this.votesRepository.findOne({
        where: { userId, postId },
      });
      if (!existingVote) {
        await this.votesRepository.save({ userId, postId, value });
        post.votesCount += value;
      } else if (existingVote.value == value) {
        await this.votesRepository.remove(existingVote);
        post.votesCount -= value;
      } else {
        existingVote.value = value;
        await this.votesRepository.save(existingVote);
        post.votesCount += value * 2;
      }
      await this.postsRepository.save(post);
      return {
        statusCode: HttpStatus.OK,
        message: Messages.VOTES.VOTE_SUCCESS,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(Messages.VOTES.VOTE_FAILURE);
    }
  }
}
