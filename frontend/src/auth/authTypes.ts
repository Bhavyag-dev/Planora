export type Role =
  | 'super_admin'
  | 'org_admin'
  | 'user'
  | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization?: any;
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

