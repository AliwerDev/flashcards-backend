import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RoleEnum, User as UserEntity } from 'src/models/user.scheme';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto, UpdateUserDto } from './dto/update.dto';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { RolesGuard } from 'src/guards/roles.gueard';

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
  @UseGuards(AuthGuard('jwt'), RolesGuard(RoleEnum.ADMIN))
  findAll() {
    return this.userService.findAll();
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  updateUser(@Body() body: UpdateUserDto, @User() user: UserEntity) {
    return this.userService.updateUser(body, String(user._id));
  }

  @Patch('role')
  @UseGuards(AuthGuard('jwt'), RolesGuard(RoleEnum.ADMIN))
  @UsePipes(new ValidationPipe())
  updateRole(@Body() body: UpdateRoleDto, @User() user: UserEntity) {
    return this.userService.updateRole(body, user);
  }

  @Put('connect')
  @UsePipes(new ValidationPipe())
  connectTg(@Body() body: CreateChatDto) {
    return this.userService.connectTgAccaunt(body);
  }
}
