import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserEntity } from '../models/user.scheme';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  findOne(@User() user: UserEntity) {
    return this.userService.findById(String(user._id));
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  findAll(@User() user: UserEntity) {
    return this.userService.findAll(user);
  }

  @Patch('role')
  @UseGuards(AuthGuard('jwt'))
  updateRole(@Body() body: UpdateRoleDto, @User() user: UserEntity) {
    return this.userService.updateRole(body, user);
  }
}
