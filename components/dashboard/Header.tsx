'use client'

import React from 'react'
import { useAuth } from '@/lib/auth-context'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import {
  Bell,
  Search,
  User,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

/**
 * Top header component with user menu and notifications
 */
export function Header() {
  const { user, logout } = useAuth()
  const { notifications, removeNotification } = useDashboardStore()

  const unreadCount = notifications.length

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>

            {unreadCount > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Notifications ({unreadCount})</h3>
                </div>
                <div className="divide-y divide-border">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-accent transition-colors ${
                        notification.type === 'error' ? 'text-red-600' : ''
                      } ${notification.type === 'success' ? 'text-green-600' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm flex-1">{notification.message}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => removeNotification(notification.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  {user && (
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user?.username || 'User'}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
