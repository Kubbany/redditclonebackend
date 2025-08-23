import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please Enter Correct Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
