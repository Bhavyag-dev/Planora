import type { AuthUser } from './authTypes';

export function getPostLoginRoute(user: AuthUser): string {
  switch (user.role) {
    case 'super_admin':
    case 'admin':
      return '/super-admin';
    case 'college_admin':
      return '/college-admin';
    case 'dept_admin':
    case 'spec_admin':
      return '/department-admin';
    case 'student':
    default:
      return '/dashboard';
  }
}

