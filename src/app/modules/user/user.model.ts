export interface User {
  _id: string;
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Role {
  _id: string;
  name?: string;
  description?: string;
  isAuthenticated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
