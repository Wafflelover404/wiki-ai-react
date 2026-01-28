"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Search, 
  FileText, 
  Bot, 
  ArrowRight, 
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Users,
  BookOpen,
  Brain,
  FileText as LeafletIcon
} from "lucide-react"
import { useTranslation } from '@/src/i18n'
import LandingHeader from '@/components/landing-header'

export default function LandingPage() {
  const { t } = useTranslation()
  
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: t('landing.features.smartSearch.title'),
      description: t('landing.features.smartSearch.description')
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: t('landing.features.aiAnswers.title'),
      description: t('landing.features.aiAnswers.description')
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('landing.features.documentManagement.title'),
      description: t('landing.features.documentManagement.description')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('landing.features.secure.title'),
      description: t('landing.features.secure.description')
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('landing.features.realTime.title'),
      description: t('landing.features.realTime.description')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('landing.features.collaboration.title'),
      description: t('landing.features.collaboration.description')
    }
  ]

  const benefits = [
    t('landing.benefits.reduceTime'),
    t('landing.benefits.improveSharing'),
    t('landing.benefits.centralizedManagement'),
    t('landing.benefits.aiInsights'),
    t('landing.benefits.security'),
    t('landing.benefits.realTimeUpdates')
  ]

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            {t('landing.hero.badge')}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('landing.hero.title')}
            <span className="text-primary">{t('landing.hero.titleHighlight')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/login">
                {t('landing.hero.getStarted')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link href="#features">
                {t('landing.hero.learnMore')}
                <BookOpen className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            {/* <Button asChild variant="secondary" size="lg" className="text-base px-8">
              <Link href="/leaflet">
                {t('landing.hero.viewBrochure')}
                <LeafletIcon className="w-4 h-4 ml-2" />
              </Link>
            </Button> */}
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t('landing.hero.noCreditCard')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t('landing.hero.freeTrial')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t('landing.hero.setupMinutes')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.features.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('landing.benefits.title')}</h2>
              <p className="text-muted-foreground text-lg mb-8">
                {t('landing.benefits.subtitle')}
              </p>
              
              <div className="space-y-4 m-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild>
                <Link href="/login">
                  {t('landing.benefits.startFreeTrial')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{t('landing.benefits.semanticSearch')}</p>
                        <p className="text-sm text-muted-foreground">{t('landing.benefits.semanticSearchDesc')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">{t('landing.benefits.aiAssistant')}</p>
                        <p className="text-sm text-muted-foreground">{t('landing.benefits.aiAssistantDesc')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">{t('landing.benefits.analytics')}</p>
                        <p className="text-sm text-muted-foreground">{t('landing.benefits.analyticsDesc')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('landing.cta.title')}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t('landing.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/login">
                {t('landing.cta.startFreeTrial')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link href="/invite">
                {t('landing.cta.requestDemo')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">WikiAI</h3>
              <p className="text-sm text-muted-foreground">
                {t('landing.footer.description')}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">{t('landing.footer.product')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">{t('landing.nav.features')}</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">{t('landing.nav.pricing')}</Link></li>
                <li><Link href="/invite" className="hover:text-foreground">{t('landing.cta.requestDemo')}</Link></li>
                <li><Link href="/leaflet" className="hover:text-foreground">{t('landing.nav.brochure')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">{t('landing.footer.company')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">{t('landing.nav.about')}</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">{t('landing.nav.contact')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">{t('landing.footer.support')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/status" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>{t('landing.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
