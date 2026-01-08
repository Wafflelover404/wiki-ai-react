/**
 * Permission Validator
 * Advanced permission checking with role hierarchy and resource-level control
 */

import { RoleLevel, ROLES, getRole, getRoleLevel, canManageRole } from './roles'

export interface PermissionContext {
  userRole: string
  organizationId?: string
  userId?: string
  resourceId?: string
  resourceType?: string
  ownerId?: string
}

/**
 * Permission Validator class
 */
export class PermissionValidator {
  /**
   * Check if user has a global permission
   */
  hasPermission(context: PermissionContext, permission: string): boolean {
    const role = getRole(context.userRole)
    if (!role) {
      console.warn(`[Permission] Unknown role: ${context.userRole}`)
      return false
    }

    const hasPermission = role.permissions.has(permission)
    console.log(`[Permission] User(${context.userRole}) ${hasPermission ? 'has' : 'lacks'} ${permission}`)
    return hasPermission
  }

  /**
   * Check resource-level permission
   */
  hasResourcePermission(
    context: PermissionContext,
    resource: string,
    action: string
  ): boolean {
    const role = getRole(context.userRole)
    if (!role) {
      console.warn(`[Permission] Unknown role: ${context.userRole}`)
      return false
    }

    const resourcePerms = role.resourcePermissions.get(resource)
    if (!resourcePerms) {
      console.log(`[Permission] Role ${context.userRole} has no access to resource: ${resource}`)
      return false
    }

    // Handle owner-specific actions
    if (action === 'update:own' || action === 'delete:own') {
      const isOwner = context.resourceId === context.userId || context.resourceId === context.ownerId
      if (isOwner) {
        const hasOwnAction = resourcePerms.has(action)
        const hasGeneralAction = resourcePerms.has(action.split(':')[0])
        const result = hasOwnAction || hasGeneralAction
        console.log(`[Permission] User ${action} own ${resource}: ${result}`)
        return result
      }
      // Fall through to check if user can do general action
    }

    const hasAction = resourcePerms.has(action)
    console.log(`[Permission] User(${context.userRole}) ${hasAction ? 'can' : 'cannot'} ${action} on ${resource}`)
    return hasAction
  }

  /**
   * Check if user can manage another user
   */
  canManageUser(context: PermissionContext, targetUserId: string, targetUserRole?: string): boolean {
    const role = getRole(context.userRole)
    if (!role) return false

    // Owner can manage anyone
    if (role.level === RoleLevel.OWNER) {
      console.log(`[Permission] Owner can manage user ${targetUserId}`)
      return true
    }

    // Admin can manage non-owners
    if (role.level === RoleLevel.ADMIN && targetUserRole) {
      const targetLevel = getRoleLevel(targetUserRole)
      const canManage = targetLevel < RoleLevel.OWNER
      console.log(`[Permission] Admin can${canManage ? '' : ' not'} manage ${targetUserRole} user`)
      return canManage
    }

    // Others can't manage
    console.log(`[Permission] User(${context.userRole}) cannot manage users`)
    return false
  }

  /**
   * Check if user can elevate another user's role
   */
  canElevateRole(context: PermissionContext, targetRole: string): boolean {
    return canManageRole(context.userRole, targetRole)
  }

  /**
   * Check if user can access file
   */
  canAccessFile(context: PermissionContext, action: 'read' | 'write' | 'delete' = 'read'): boolean {
    return this.hasResourcePermission(context, 'files', action)
  }

  /**
   * Check if user can perform action on organization
   */
  canAccessOrganization(context: PermissionContext, action: string = 'read'): boolean {
    const role = getRole(context.userRole)
    if (!role) return false

    // Owner can do anything
    if (role.level === RoleLevel.OWNER) return true

    // Admin can read
    if (role.level === RoleLevel.ADMIN && action === 'read') return true

    return false
  }

  /**
   * Get accessible resources for user
   */
  getAccessibleResources(context: PermissionContext): string[] {
    const role = getRole(context.userRole)
    if (!role) return []
    return Array.from(role.resourcePermissions.keys())
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(context: PermissionContext): string[] {
    const role = getRole(context.userRole)
    if (!role) return []
    return Array.from(role.permissions)
  }

  /**
   * Check role hierarchy
   */
  isRoleHigherThan(role1: string, role2: string): boolean {
    const level1 = getRoleLevel(role1)
    const level2 = getRoleLevel(role2)
    return level1 > level2
  }

  /**
   * Check if role is admin or above
   */
  isAdminOrAbove(roleName: string): boolean {
    const level = getRoleLevel(roleName)
    return level >= RoleLevel.ADMIN
  }

  /**
   * Check if role is editor or above
   */
  isEditorOrAbove(roleName: string): boolean {
    const level = getRoleLevel(roleName)
    return level >= RoleLevel.EDITOR
  }

  /**
   * Validate permission context (checks for required fields)
   */
  validateContext(context: PermissionContext): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!context.userRole) {
      errors.push('userRole is required')
    }

    if (!getRole(context.userRole)) {
      errors.push(`Unknown role: ${context.userRole}`)
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// Create singleton instance
export const permissionValidator = new PermissionValidator()

export default permissionValidator
