import { RoleEnum } from 'src/models/user.scheme';

export default interface ITokenPayload {
  roles: RoleEnum[];
  email: string;
  sub: string;
}
