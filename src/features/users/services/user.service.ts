import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../entites/user.entity';
import { UserDTO } from '../dtos/user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userDto: UserDTO): Promise<User> {
    const { email, name, password } = userDto;
    const userExist = await this.userRepository.findOne({ where: { email } });
    if (userExist) {
      throw new ConflictException('Email Already Exists');
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      password: encryptedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
