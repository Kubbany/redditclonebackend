import { Controller, Get, UseGuards } from '@nestjs/common';

import { RegisterResponseDTO } from '../../auth/dtos/register_response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../services/users.services';
import { CurrentUser } from 'src/features/auth/decorators/get_current_user.decorator';
import type { JwtPayload } from 'src/features/auth/decorators/get_current_user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('currentUser')
  async getCurrentUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<RegisterResponseDTO> {
    return this.usersService.getCurrentUser(user);
  }
}
