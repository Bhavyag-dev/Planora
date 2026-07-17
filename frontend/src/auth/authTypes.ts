export type Role =
  | 'super_admin'
  | 'college_admin'
  | 'dept_admin'
  | 'spec_admin'
  | 'student'
  | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  college?: any;
  department?: any;
  specialization?: any;
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

