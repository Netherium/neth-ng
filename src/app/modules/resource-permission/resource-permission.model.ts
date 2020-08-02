import { Role } from '../../models/role.model';

export interface ResourcePermission {
  _id: string;
  resourceName?: string;
  methods?: ResourcePermissionMethod[];
  createdAt?: string;
  updatedAt?: string;
}

interface ResourcePermissionMethod {
  name: string,
  roles: Role[]
}
