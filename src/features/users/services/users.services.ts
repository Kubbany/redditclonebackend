import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entites/user.entity';
import { RegisterResponseDTO } from '../../auth/dtos/register_response.dto';
import { JwtPayload } from 'src/features/auth/decorators/get_current_user.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCurrentUser(payload: JwtPayload): Promise<RegisterResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'name', 'email'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { id: user.id, name: user.name, email: user.email };
  }
}
