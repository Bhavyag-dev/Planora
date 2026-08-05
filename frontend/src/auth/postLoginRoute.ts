import type { AuthUser } from './authTypes';

export function getPostLoginRoute(user: AuthUser): string {
  return '/dashboard';
}
