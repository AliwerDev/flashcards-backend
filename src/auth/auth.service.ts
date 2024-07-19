import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly googleUserInfoUrl =
    'https://www.googleapis.com/oauth2/v3/userinfo';
  constructor(private userService: UserService) {}

  async signInPayload(payload: any) {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '8d' });
  }
  async validateUser(payload: any): Promise<any> {
    return this.userService.findByPayload(payload);
  }
  async signInWithGoogle(req: { user: any }): Promise<any> {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User Info from Google',
      user: req.user,
    };
  }

  async getUserInfoFromGoogle(accessToken: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(this.googleUserInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user info: ${error.message}`);
    }
  }
}
