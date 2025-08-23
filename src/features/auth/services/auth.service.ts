import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../../users/entites/user.entity';
import { RegisterRequestDTO } from '../dtos/register_request.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterResponseDTO } from '../dtos/register_response.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {}

  async register(
    registerDTO: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    const { email, name, password } = registerDTO;
    const userExist = await this.authRepository.findOne({ where: { email } });
    if (userExist) {
      throw new ConflictException('Email Already Exists');
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = this.authRepository.create({
      name,
      email,
      password: encryptedPassword,
    });
    const savedUser = await this.authRepository.save(newUser);
    return { id: savedUser.id, name: savedUser.name, email: savedUser.email };
  }
}
