import { Role } from './role.model';

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
