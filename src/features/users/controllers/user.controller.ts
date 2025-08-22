import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDTO } from '../dtos/user.dto';
import User from '../entites/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDTO: UserDTO): Promise<User> {
    return this.userService.createUser(userDTO);
  }
}
