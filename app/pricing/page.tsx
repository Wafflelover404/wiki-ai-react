"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Users,
  ArrowRight,
  Crown,
  Building
} from "lucide-react"
import { useTranslation } from '@/src/i18n'
import LandingHeader from '@/components/landing-header'

export default function PricingPage() {
  const { t } = useTranslation()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: t('pricing.plans.starter.name'),
      description: t('pricing.plans.starter.description'),
      price: isAnnual ? 29 : 35,
      yearlyPrice: 348,
      icon: <Star className="w-6 h-6" />,
      features: [
        t('pricing.features.upToUsers', { count: 10 }),
        `1,000 ${t('pricing.features.documents')}`,
        t('pricing.features.basicAiSearch'),
        t('pricing.features.emailSupport'),
        `5GB ${t('pricing.features.storage')}`,
        t('pricing.features.standardSecurity')
      ],
      notIncluded: [
        t('pricing.features.advancedAiFeatures'),
        t('pricing.features.realTimeCollaboration'),
        t('pricing.features.customIntegrations'),
        t('pricing.features.prioritySupport')
      ],
      popular: false,
      buttonText: t('pricing.plans.starter.buttonText')
    },
    {
      name: t('pricing.plans.professional.name'),
      description: t('pricing.plans.professional.description'),
      price: isAnnual ? 79 : 99,
      yearlyPrice: 948,
      icon: <Zap className="w-6 h-6" />,
      features: [
        t('pricing.features.upToUsers', { count: 50 }),
        `10,000 ${t('pricing.features.documents')}`,
        t('pricing.features.advancedAiSearch'),
        t('pricing.features.realTimeCollaboration'),
        `50GB ${t('pricing.features.storage')}`,
        t('pricing.features.prioritySupport'),
        t('pricing.features.customIntegrations'),
        t('pricing.features.advancedAnalytics')
      ],
      notIncluded: [
        t('pricing.features.dedicatedAccountManager'),
        t('pricing.features.customAiTraining'),
        t('pricing.features.slaGuarantee')
      ],
      popular: true,
      buttonText: t('pricing.plans.professional.buttonText')
    },
    {
      name: t('pricing.plans.enterprise.name'),
      description: t('pricing.plans.enterprise.description'),
      price: "Custom",
      yearlyPrice: null,
      icon: <Building className="w-6 h-6" />,
      features: [
        t('pricing.features.unlimitedUsers'),
        t('pricing.features.unlimitedDocuments'),
        t('pricing.features.customAiTraining'),
        t('pricing.features.dedicatedAccountManager'),
        t('pricing.features.unlimitedStorage'),
        t('pricing.features.phoneSupport'),
        t('pricing.features.advancedSecurity'),
        t('pricing.features.customIntegrations'),
        t('pricing.features.slaGuarantee'),
        t('pricing.features.onpremiseDeployment')
      ],
      notIncluded: [],
      popular: false,
      buttonText: t('pricing.plans.enterprise.buttonText')
    }
  ]

  const faqs = [
    {
      question: t('pricing.faq.question1'),
      answer: t('pricing.faq.answer1')
    },
    {
      question: t('pricing.faq.question2'),
      answer: t('pricing.faq.answer2')
    },
    {
      question: t('pricing.faq.question3'),
      answer: t('pricing.faq.answer3')
    },
    {
      question: t('pricing.faq.question4'),
      answer: t('pricing.faq.answer4')
    },
    {
      question: t('pricing.faq.question5'),
      answer: t('pricing.faq.answer5')
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">{t('pricing.hero.badge')}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('pricing.hero.title')}
            <span className="text-primary">{t('pricing.hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            {t('pricing.hero.subtitle')}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>{t('pricing.hero.monthly')}</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              {t('pricing.hero.annual')}
              <Badge variant="secondary" className="ml-2">{t('pricing.hero.save')}</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary scale-105' : 'hover:-translate-y-1'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Crown className="w-3 h-3 mr-1" />
                      {t('pricing.plans.starter.mostPopular')}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{plan.icon}</div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="mb-6">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                        {isAnnual && (
                          <p className="text-sm text-green-600 mt-2">
                            ${plan.yearlyPrice} billed annually
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">{plan.price}</span>
                    )}
                  </div>
                  
                  <Button 
                    className={`w-full mb-8 ${plan.popular ? 'bg-primary' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3 opacity-50">
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.comparison.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('pricing.comparison.subtitle')}
            </p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">{t('pricing.comparison.feature')}</th>
                      <th className="text-center py-3 px-4">{t('pricing.plans.starter.name')}</th>
                      <th className="text-center py-3 px-4">{t('pricing.plans.professional.name')}</th>
                      <th className="text-center py-3 px-4">{t('pricing.plans.enterprise.name')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: t('pricing.comparison.users'), starter: "10", professional: "50", enterprise: t('pricing.features.unlimitedUsers') },
                      { feature: t('pricing.comparison.documents'), starter: "1,000", professional: "10,000", enterprise: t('pricing.features.unlimitedDocuments') },
                      { feature: t('pricing.comparison.storage'), starter: "5GB", professional: "50GB", enterprise: t('pricing.features.unlimitedStorage') },
                      { feature: t('pricing.comparison.aiSearch'), starter: t('pricing.features.basicAiSearch'), professional: t('pricing.features.advancedAiSearch'), enterprise: t('pricing.features.customAiTraining') },
                      { feature: t('pricing.comparison.support'), starter: t('pricing.features.emailSupport'), professional: t('pricing.features.prioritySupport'), enterprise: t('pricing.features.phoneSupport') },
                      { feature: t('pricing.comparison.integrations'), starter: t('pricing.comparison.integrations'), professional: t('pricing.features.customIntegrations'), enterprise: t('pricing.features.unlimitedUsers') },
                      { feature: t('pricing.comparison.analytics'), starter: t('pricing.comparison.analytics'), professional: t('pricing.features.advancedAnalytics'), enterprise: t('pricing.features.customAiTraining') },
                      { feature: t('pricing.comparison.sla'), starter: t('pricing.comparison.sla'), professional: t('pricing.comparison.sla'), enterprise: "99.9%" }
                    ].map((row, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{row.feature}</td>
                        <td className="text-center py-3 px-4">{row.starter}</td>
                        <td className="text-center py-3 px-4">{row.professional}</td>
                        <td className="text-center py-3 px-4">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.faq.title')}</h2>
            <p className="text-muted-foreground text-lg">
              {t('pricing.faq.subtitle')}
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('pricing.cta.title')}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t('pricing.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              {t('pricing.cta.startFreeTrial')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              {t('pricing.cta.contactSales')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
