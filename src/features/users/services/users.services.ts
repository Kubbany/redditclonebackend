import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entites/user.entity';
import { UserResponseDTO } from '../dtos/user_response.dto';
import { JwtPayloadDTO } from 'src/features/auth/dtos/jwt_payload.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCurrentUser(payload: JwtPayloadDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'name', 'email'],
    });

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    return { id: user.id, name: user.name, email: user.email };
  }
}
