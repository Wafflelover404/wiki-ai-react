"use client"

import { useState } from "react"
import { useTranslation } from "@/src/i18n"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

interface Language {
  name: string
  code: string
}

export function LanguageSwitcher() {
  const { locale, changeLanguage, availableLanguages } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Languages className="w-4 h-4 mr-2" />
          {(availableLanguages[locale as keyof typeof availableLanguages] as Language)?.name || locale}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(availableLanguages).map(([code, language]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code)}
            className={locale === code ? "bg-accent" : ""}
          >
            {(language as Language).name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
