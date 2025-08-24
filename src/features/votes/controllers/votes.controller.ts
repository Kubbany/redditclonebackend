import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/features/auth/decorators/get_current_user.decorator';
import { VoteRequestDTO } from '../dtos/vote_request.dto';
import { VoteResponseDTO } from '../dtos/vote_response.dto';
import { VotesService } from '../services/votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async votePost(
    @CurrentUser('sub') userId: number,
    @Body() voteRequestDto: VoteRequestDTO,
  ): Promise<VoteResponseDTO> {
    return await this.votesService.votePost(userId, voteRequestDto);
  }
}
