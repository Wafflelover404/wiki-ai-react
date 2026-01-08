/**
 * Role Definitions and Hierarchy
 * Defines roles, their levels, and associated permissions
 */

export enum RoleLevel {
  VIEWER = 1,
  EDITOR = 2,
  ADMIN = 3,
  OWNER = 4,
}

export const ROLE_HIERARCHY = {
  viewer: RoleLevel.VIEWER,
  editor: RoleLevel.EDITOR,
  admin: RoleLevel.ADMIN,
  owner: RoleLevel.OWNER,
} as const

export interface RoleDefinition {
  name: string
  level: RoleLevel
  permissions: Set<string>
  resourcePermissions: Map<string, Set<string>>
  description: string
}

/**
 * Define all roles with their permissions
 */
export const ROLES: Record<string, RoleDefinition> = {
  viewer: {
    name: 'Viewer',
    level: RoleLevel.VIEWER,
    description: 'Read-only access to files and documents',
    permissions: new Set(['view:files', 'view:stats', 'search:files']),
    resourcePermissions: new Map([
      ['files', new Set(['read'])],
    ]),
  },

  editor: {
    name: 'Editor',
    level: RoleLevel.EDITOR,
    description: 'Can create and edit own resources',
    permissions: new Set([
      'view:files',
      'create:files',
      'edit:own_files',
      'delete:own_files',
      'upload:files',
      'view:stats',
      'search:files',
      'download:files',
    ]),
    resourcePermissions: new Map([
      ['files', new Set(['read', 'create', 'update:own', 'delete:own', 'download'])],
    ]),
  },

  admin: {
    name: 'Administrator',
    level: RoleLevel.ADMIN,
    description: 'Full admin access to system and organization',
    permissions: new Set([
      'view:files',
      'create:files',
      'edit:all_files',
      'delete:all_files',
      'upload:files',
      'download:files',
      'manage:users',
      'view:system_stats',
      'manage:api_keys',
      'view:reports',
      'search:files',
    ]),
    resourcePermissions: new Map([
      ['files', new Set(['read', 'create', 'update', 'delete', 'download'])],
      ['users', new Set(['read', 'create', 'update', 'delete'])],
      ['reports', new Set(['read', 'create', 'update', 'delete'])],
      ['api_keys', new Set(['read', 'create', 'update', 'delete'])],
    ]),
  },

  owner: {
    name: 'Owner',
    level: RoleLevel.OWNER,
    description: 'Complete ownership of organization',
    permissions: new Set([
      'view:files',
      'create:files',
      'edit:all_files',
      'delete:all_files',
      'upload:files',
      'download:files',
      'manage:users',
      'manage:organizations',
      'view:system_stats',
      'manage:api_keys',
      'view:reports',
      'search:files',
      'manage:settings',
    ]),
    resourcePermissions: new Map([
      ['files', new Set(['read', 'create', 'update', 'delete', 'download'])],
      ['users', new Set(['read', 'create', 'update', 'delete'])],
      ['reports', new Set(['read', 'create', 'update', 'delete'])],
      ['api_keys', new Set(['read', 'create', 'update', 'delete'])],
      ['organization', new Set(['read', 'update', 'delete'])],
      ['settings', new Set(['read', 'update', 'delete'])],
    ]),
  },
}

/**
 * Get role by name
 */
export function getRole(roleName: string): RoleDefinition | null {
  return ROLES[roleName.toLowerCase()] || null
}

/**
 * Get role level
 */
export function getRoleLevel(roleName: string): RoleLevel {
  const role = getRole(roleName)
  return role?.level ?? RoleLevel.VIEWER
}

/**
 * Check if one role can manage another
 */
export function canManageRole(managerRole: string, targetRole: string): boolean {
  const managerLevel = getRoleLevel(managerRole)
  const targetLevel = getRoleLevel(targetRole)
  return managerLevel > targetLevel
}

/**
 * Get all available roles
 */
export function getAllRoles(): RoleDefinition[] {
  return Object.values(ROLES)
}

/**
 * Get roles above or equal to a certain level
 */
export function getRolesAboveLevel(level: RoleLevel): RoleDefinition[] {
  return Object.values(ROLES).filter(role => role.level >= level)
}

/**
 * Format role name for display
 */
export function formatRoleName(roleName: string): string {
  const role = getRole(roleName)
  return role ? role.name : roleName.charAt(0).toUpperCase() + roleName.slice(1)
}

export default ROLES
