import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../../users/entites/user.entity';
import { RegisterRequestDTO } from '../dtos/register_request.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDTO } from '../dtos/login_request.dto';
import { Messages } from 'src/utils/messages.utils';
import { ResponseDTO } from 'src/utils/dtos/response.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerRequestDTO: RegisterRequestDTO): Promise<ResponseDTO> {
    const { email, name, password } = registerRequestDTO;
    const userExist = await this.authRepository.findOne({ where: { email } });
    if (userExist) {
      throw new ConflictException(Messages.AUTH.REGISTER_EMAIL_EXISTS);
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = this.authRepository.create({
      name,
      email,
      password: encryptedPassword,
    });
    await this.authRepository.save(newUser);
    return {
      statusCode: HttpStatus.CREATED,
      message: Messages.AUTH.REGISTER_SUCCESS,
    };
  }

  async login(loginRequestDTO: LoginRequestDTO): Promise<{ token: string }> {
    const { email, password } = loginRequestDTO;
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(Messages.AUTH.LOGIN_FAILURE);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException(Messages.AUTH.LOGIN_FAILURE);
    }
    const token = this.jwtService.sign({ sub: user.id, name: user.name });
    return { token };
  }
}
