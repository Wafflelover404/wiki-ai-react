"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Users, 
  Target, 
  Lightbulb, 
  Award, 
  ArrowRight,
  Star,
  Globe,
  TrendingUp,
  Heart
} from "lucide-react"
import { useTranslation } from '@/src/i18n'
import LandingHeader from '@/components/landing-header'

export default function AboutPage() {
  const { t } = useTranslation()
  
  const milestones = [
    {
      year: "2022",
      title: t('about.journey.title'),
      description: t('about.journey.subtitle')
    },
    {
      year: "2023",
      title: t('about.journey.title'),
      description: t('about.journey.subtitle')
    },
    {
      year: "2024",
      title: t('about.journey.title'),
      description: t('about.journey.subtitle')
    },
    {
      year: "2025",
      title: t('about.journey.title'),
      description: t('about.journey.subtitle')
    }
  ]

  const values = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('about.values.customerCentric.title'),
      description: t('about.values.customerCentric.description')
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('about.values.passion.title'),
      description: t('about.values.passion.description')
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description')
    }
  ]

  const stats = [
    { number: "10,000+", label: t('about.stats.activeUsers') },
    { number: "500+", label: t('about.stats.enterpriseCustomers') },
    { number: "99.9%", label: t('about.stats.uptime') },
    { number: "4.9/5", label: t('about.stats.customerRating') }
  ]

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">{t('about.hero.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {t('about.hero.title')}
              <span className="text-primary">{t('about.hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('about.mission.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('about.mission.subtitle1')}
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('about.mission.subtitle2')}
              </p>
              <div className="flex items-center gap-4">
                <Button size="lg">
                  {t('about.mission.joinJourney')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">{t('about.mission.rating')}</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-8">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple/20 rounded-lg flex items-center justify-center">
                    <Target className="w-24 h-24 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.values.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{value.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 py-16 border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.journey.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('about.journey.subtitle')}
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow inline-block text-left">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-2">{milestone.year}</Badge>
                      <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.team.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "CEO & Founder", bio: "Former AI researcher at Google, now leading our vision." },
              { name: "Marcus Johnson", role: "CTO", bio: "Tech visionary with 15+ years in enterprise software." },
              { name: "Emily Rodriguez", role: "Head of Product", bio: "Passionate about creating user-centric AI solutions." }
            ].map((member, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('about.joinUs.title')}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t('about.joinUs.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              {t('about.joinUs.viewPositions')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              {t('about.joinUs.contactUs')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
