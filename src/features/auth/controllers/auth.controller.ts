import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../dtos/register_request.dto';
import { RegisterResponseDTO } from '../dtos/register_response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerRequestDTO: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    return this.userService.register(registerRequestDTO);
  }
}
