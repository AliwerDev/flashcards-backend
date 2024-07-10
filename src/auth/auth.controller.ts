import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/shared/dto/register.dto';
import { LoginDto } from 'src/shared/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async create(@Body() createAuthDto: RegisterDto) {
    const user = await this.userService.create(createAuthDto);

    const payload = { email: user.email, sub: user._id };

    const token = await this.authService.signInPayload(payload);

    return { user, token };
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByLogin(loginDto);

    const payload = { email: user.email, sub: user._id };

    const token = await this.authService.signInPayload(payload);

    return { user, token };
  }
}
