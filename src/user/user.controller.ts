import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserEntity } from 'src/models/user.scheme';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  findOne(@User() user: UserEntity) {
    return this.userService.findById(String(user._id));
  }
}
