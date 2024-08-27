import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [SharedModule, UserModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
