import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signInPayload(payload: any) {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '8d' });
  }
  async validateUser(payload: any): Promise<any> {
    return this.userService.findByPayload(payload);
  }
}
