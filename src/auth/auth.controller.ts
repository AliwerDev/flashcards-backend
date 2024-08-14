import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from '../user/user.service';
import { RegisterDto } from '../user/dto/register.dto';
import { LoginDto } from '../user/dto/login.dto';
import { GoogleLoginDto } from '../shared/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user.decorator';
import { User as UserEntity } from 'src/models/user.scheme';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

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

  @Post('login-by-google')
  @UsePipes(new ValidationPipe())
  async loginByGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    let userGoogleData;

    if (googleLoginDto.credential) {
      const ticket = await client.verifyIdToken({
        idToken: googleLoginDto.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      userGoogleData = ticket.getPayload();
    } else {
      userGoogleData = await this.authService.getUserInfoFromGoogle(
        googleLoginDto.access_token,
      );
    }

    let user = await this.userService.findByEmail(userGoogleData.email);
    if (!user)
      user = await this.userService.create({
        email: userGoogleData.email,
        firstName: userGoogleData.given_name,
        lastName: userGoogleData.family_name,
        picture: userGoogleData.picture,
        password: userGoogleData.email.split('@')[0],
      });

    const payload = { email: user.email, sub: user._id };
    const token = await this.authService.signInPayload(payload);
    return { user, token };
  }

  @Get('token')
  @UseGuards(AuthGuard('jwt'))
  async redirectTg(@User() user: UserEntity) {
    const payload = { email: user.email, sub: user._id };
    const token = await this.authService.signInPayload(payload);
    return token;
  }
}
