'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import { useAuth } from '@/lib/auth-context'
import {
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  Users,
  LogOut,
  Menu,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isAdmin: boolean
}

/**
 * Sidebar navigation component that shows different menu items based on user role
 */
export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { sidebarOpen, toggleSidebar, currentView, setCurrentView } =
    useDashboardStore()

  const menuItems = isAdmin
    ? [
        {
          label: 'Overview',
          icon: BarChart3,
          href: '/app',
          view: 'overview' as const,
        },
        {
          label: 'Users',
          icon: Users,
          href: '/app/admin/users',
          view: 'overview' as const,
        },
        {
          label: 'Files',
          icon: FileText,
          href: '/app/admin/files',
          view: 'files' as const,
        },
        {
          label: 'Reports',
          icon: BarChart3,
          href: '/app/admin/reports',
          view: 'reports' as const,
        },
        {
          label: 'Settings',
          icon: Settings,
          href: '/app/admin/settings',
          view: 'settings' as const,
        },
      ]
    : [
        {
          label: 'Dashboard',
          icon: BarChart3,
          href: '/app',
          view: 'overview' as const,
        },
        {
          label: 'Files',
          icon: FileText,
          href: '/app/files',
          view: 'files' as const,
        },
        {
          label: 'Chat',
          icon: MessageSquare,
          href: '/app/query',
          view: 'queries' as const,
        },
        {
          label: 'Settings',
          icon: Settings,
          href: '/app/settings',
          view: 'settings' as const,
        },
      ]

  return (
    <aside className="h-full bg-sidebar border-r border-border flex flex-col">
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {sidebarOpen && <span className="font-semibold">Menu</span>}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-0 w-9 h-9"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => setCurrentView(item.view)}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && sidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section with user info */}
      <div className="border-t border-border p-4 space-y-2">
        {isAdmin && sidebarOpen && (
          <div className="flex items-center gap-2 px-2 py-1 text-xs bg-primary/10 rounded text-primary">
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </div>
        )}

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
