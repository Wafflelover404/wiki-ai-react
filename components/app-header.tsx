"use client"

import React from "react"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Moon, Sun } from "lucide-react"
import { useTranslation } from "@/src/i18n"
import { LanguageSwitcher } from "@/src/components/language-switcher"

interface AppHeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">{t('navigation.home')}</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <React.Fragment key={`crumb-${index}-${crumb.label}`}>
                {index !== 0 && <BreadcrumbSeparator key={`sep-${crumb.label}`} />}
                <BreadcrumbItem key={crumb.label}>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('navigation.toggleTheme')}</span>
        </Button>
      </div>
    </header>
  )
}
