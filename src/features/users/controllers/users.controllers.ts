import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../services/users.services';
import { CurrentUser } from 'src/features/auth/decorators/get_current_user.decorator';
import { UserResponseDTO } from '../dtos/user_response.dto';
import { JwtPayloadDTO } from 'src/features/auth/dtos/jwt_payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('current-user')
  async getCurrentUser(
    @CurrentUser() user: JwtPayloadDTO,
  ): Promise<UserResponseDTO> {
    return await this.usersService.getCurrentUser(user);
  }
}
