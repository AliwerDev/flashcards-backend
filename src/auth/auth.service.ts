import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
  private githubAccessTokenUrl = 'https://github.com/login/oauth/access_token';
  private githubUserDataUrl = 'https://api.github.com/user';

  constructor(private userService: UserService) {}

  async signInPayload(payload: any) {
    return sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8d',
    });
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
      throw new HttpException(
        `Failed to fetch user info: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getGithubAccessToken(code: string): Promise<any> {
    const param = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;

    try {
      const response: AxiosResponse = await axios.post(
        this.githubAccessTokenUrl + param,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch github access token info: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserDataFromGithub(accessToken: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(this.githubUserDataUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch github user info: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
