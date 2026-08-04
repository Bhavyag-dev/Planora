import type { AuthUser } from './authTypes';

export function getPostLoginRoute(user: AuthUser): string {
  switch (user.role) {
    case 'super_admin':
    case 'admin':
      return '/super-admin';
    case 'org_admin':
      return '/org-admin';
    case 'user':
    default:
      return '/dashboard';
  }
}

