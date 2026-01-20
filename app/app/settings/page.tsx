"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Building, Shield, Bell, Moon, Globe, Loader2, Languages } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { useTranslation } from "@/src/i18n"

export default function SettingsPage() {
  const { user, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t, locale, changeLanguage, availableLanguages } = useTranslation()
  const [notifications, setNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success(t('settings.settingsSavedSuccessfully'))
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: t('settings.title') }]} />
      <main className="flex-1 p-6 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t('settings.accountInformation')}</CardTitle>
                <CardDescription>{t('settings.accountDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('settings.username')}</Label>
                <Input value={user?.username || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>{t('settings.role')}</Label>
                <div className="flex items-center gap-2 h-10">
                  <Badge variant={isAdmin ? "default" : "secondary"} className="capitalize">
                    {isAdmin ? (
                      <>
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-1" />
                        User
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.organization')}</Label>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>{user?.organization || t('settings.noOrganization')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Moon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle>{t('settings.appearance')}</CardTitle>
                <CardDescription>{t('settings.appearanceDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">{t('settings.darkMode')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.darkModeDescription')}</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">{t('settings.systemTheme')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.systemThemeDescription')}</p>
              </div>
              <Switch
                checked={theme === "system"}
                onCheckedChange={(checked) => setTheme(checked ? "system" : "dark")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-chart-3" />
              </div>
              <div>
                <CardTitle>{t('settings.notifications')}</CardTitle>
                <CardDescription>{t('settings.notificationsDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">{t('settings.emailNotifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDescription')}</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">{t('settings.reportAlerts')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.reportAlertsDescription')}</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <CardTitle>{t('settings.languageAndRegion')}</CardTitle>
                <CardDescription>{t('settings.languageDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>{t('settings.language')}</Label>
              <Select value={locale} onValueChange={changeLanguage}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <SelectValue placeholder={t('settings.selectLanguage')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(availableLanguages).map(([code, language]) => (
                    <SelectItem key={code} value={code}>
                      <div className="flex items-center gap-2">
                        <span>{language.name}</span>
                        {locale === code && (
                          <Badge variant="secondary" className="text-xs">
                            {t('settings.current')}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.languageChangeNote')}
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('settings.saving')}
                </>
              ) : (
                t('settings.saveChanges')
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  )
}
