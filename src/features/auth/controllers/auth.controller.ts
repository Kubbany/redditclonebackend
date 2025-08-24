import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../dtos/register_request.dto';
import { RegisterResponseDTO } from '../dtos/register_response.dto';
import { LoginRequestDTO } from '../dtos/login_request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerRequestDTO: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    return await this.authService.register(registerRequestDTO);
  }

  @Post('login')
  async login(
    @Body() loginRequestDTO: LoginRequestDTO,
  ): Promise<{ token: string }> {
    return await this.authService.login(loginRequestDTO);
  }
}
