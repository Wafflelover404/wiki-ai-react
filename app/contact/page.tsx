"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Building,
  ArrowRight,
  CheckCircle
} from "lucide-react"
import { useTranslation } from '@/src/i18n'
import LandingHeader from '@/components/landing-header'

export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          inquiry_type: "general",
          priority: "normal"
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: "", email: "", company: "", message: "" })
      } else {
        setError("Failed to submit form. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactOptions = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('contact.options.emailSupport.title'),
      description: t('contact.options.emailSupport.description'),
      email: "info.wikiai@gmail.com",
      phone: null,
      hours: t('contact.options.emailSupport.hours')
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('contact.options.phoneSupport.title'),
      description: t('contact.options.phoneSupport.description'),
      email: null,
      phone: "+375 297 345 682",
      hours: t('contact.options.phoneSupport.hours')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('contact.options.telegramSupport.title'),
      description: t('contact.options.telegramSupport.description'),
      email: null,
      phone: null,
      hours: t('contact.options.telegramSupport.hours'),
      telegram: "https://t.me/vikigolubeva"
    }
  ]

  const offices = [
    {
      city: t('contact.companyInfo.globalSupport.title'),
      address: t('contact.companyInfo.globalSupport.address'),
      phone: "+375 297 345 682",
      isHQ: true
    },
    {
      city: t('contact.companyInfo.community.title'),
      address: t('contact.companyInfo.community.description'),
      phone: null,
      telegram: "https://t.me/vikigolubeva",
      isHQ: false
    }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('contact.success.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('contact.success.subtitle')}
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              {t('contact.success.sendAnother')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">{t('contact.hero.badge')}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('contact.hero.title')}
            <span className="text-primary">{t('contact.hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <div className="text-primary">{option.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{option.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${option.email}`} className="text-primary hover:underline">
                        {option.email}
                      </a>
                    </div>
                    {option.phone && (
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${option.phone}`} className="text-primary hover:underline">
                          {option.phone}
                        </a>
                      </div>
                    )}
                    {option.telegram && (
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <a href={option.telegram} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Join Telegram
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{option.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('contact.form.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.name')} *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.email')} *</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('contact.form.company')}</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder={t('contact.form.companyPlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('contact.form.message')} *</label>
                  <Textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      {t('contact.form.sendMessage')}
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Company Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('contact.companyInfo.title')}</h2>
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {t('contact.companyInfo.globalSupport.title')}
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>{t('contact.companyInfo.globalSupport.address')}</p>
                      <p><a href="mailto:info.wikiai@gmail.com" className="text-primary hover:underline">info.wikiai@gmail.com</a></p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-primary" />
                      {t('contact.companyInfo.phoneSupport.title')}
                    </h3>
                    <div className="space-y-2">
                      <p><a href="tel:+375297345682" className="text-primary hover:underline">+375 297 345 682</a></p>
                      <p className="text-sm text-muted-foreground">{t('contact.companyInfo.phoneSupport.hours')}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {t('contact.companyInfo.community.title')}
                    </h3>
                    <div className="space-y-2">
                      <p><a href="https://t.me/vikigolubeva" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join our Telegram</a></p>
                      <p className="text-sm text-muted-foreground">{t('contact.companyInfo.community.description')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('contact.offices.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('contact.offices.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold">{office.city}</h3>
                    {office.isHQ && (
                      <Badge variant="secondary">{t('contact.offices.hq')}</Badge>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {office.address}
                      </p>
                    </div>
                    {office.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${office.phone}`} className="text-sm text-primary hover:underline">
                          {office.phone}
                        </a>
                      </div>
                    )}
                    {office.telegram && (
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={office.telegram} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          Join Telegram
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('contact.faq.title')}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t('contact.faq.subtitle')}
          </p>
          <Button size="lg">
            {t('contact.faq.viewFaq')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
