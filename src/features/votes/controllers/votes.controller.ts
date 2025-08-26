import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/features/auth/decorators/get_current_user.decorator';
import { VoteRequestDTO } from '../dtos/vote_request.dto';
import { VotesService } from '../services/votes.service';
import { ResponseDTO } from 'src/utils/dtos/response.dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async votePost(
    @CurrentUser('sub') userId: number,
    @Body() voteRequestDto: VoteRequestDTO,
  ): Promise<ResponseDTO> {
    return await this.votesService.votePost(userId, voteRequestDto);
  }
}
