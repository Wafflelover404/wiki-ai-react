"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Languages,
  User,
  LogOut,
  Settings
} from 'lucide-react'
import { useTranslation } from '@/src/i18n'
import { useTheme } from 'next-themes'
import { useAuth } from '@/lib/auth-context'

export default function LandingHeader() {
  const { t, locale, changeLanguage, availableLanguages } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isLoggedIn = !!user

  const navigation = [
    { name: t('landing.nav.features'), href: '#features' },
    { name: t('landing.nav.pricing'), href: '/pricing' },
    { name: t('landing.nav.about'), href: '/about' },
    { name: t('landing.nav.contact'), href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-14 relative px-4">
        {}
        <div className="flex items-center">
          <Link href="/landing" className="flex items-center">
           <span className="ml-5 text-xl font-bold">Wiki</span><span className="text-xl font-bold mr-4">Ai</span>
          </Link>
          
          {}
          <nav className="ml-0 hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center space-x-4">
          {}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isLoggedIn ? user?.username : t('landing.nav.account')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {}
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('settings.darkMode')}</span>
                  </div>
                  <Switch 
                    checked={theme === "dark"} 
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                  />
                </div>
              </div>
              
              <DropdownMenuItem asChild>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4" />
                    <span>{t('settings.language')}</span>
                  </div>
                  <Select value={locale} onValueChange={changeLanguage}>
                    <SelectTrigger className="w-20 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(availableLanguages).map(([code, language]) => (
                        <SelectItem key={code} value={code} className="text-xs">
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center space-x-2 w-full">
                  <Settings className="h-4 w-4" />
                  <span>{t('navigation.settings')}</span>
                </Link>
              </DropdownMenuItem>
              
              {isLoggedIn ? (
                <DropdownMenuItem 
                  className="flex items-center space-x-2 text-red-600"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('navigation.logout')}</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center space-x-2 w-full">
                    <User className="h-4 w-4" />
                    <span>{t('landing.nav.signIn')}</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {}
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {}
            <div className="flex flex-col space-y-4 pt-4 border-t">
              {}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Language</span>
                </div>
                <Select value={locale} onValueChange={changeLanguage}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(availableLanguages).map(([code, language]) => (
                      <SelectItem key={code} value={code} className="text-xs">
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Theme</span>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                />
              </div>

              {}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('landing.nav.signIn')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
