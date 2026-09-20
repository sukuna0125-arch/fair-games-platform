import { ROLE_PERMISSIONS, type AdminRole } from '@/lib/admin/audit';

export function hasPermission(role: AdminRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return permissions.includes('*') || permissions.includes(permission);
}
