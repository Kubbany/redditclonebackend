import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entites/user.entity';
import { UserResponseDTO } from '../dtos/user_response.dto';
import { JwtPayloadDTO } from 'src/features/auth/dtos/jwt_payload.dto';
import { Messages } from 'src/utils/messages.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCurrentUser(payload: JwtPayloadDTO): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        select: ['name', 'email'],
      });

      if (!user) {
        throw new NotFoundException(Messages.USER.USER_NOT_FOUND);
      }
      return { name: user.name, email: user.email };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(Messages.GENERAL.SERVER_ERROR);
    }
  }
}
