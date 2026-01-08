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

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started",
      price: isAnnual ? 29 : 35,
      yearlyPrice: 348,
      icon: <Star className="w-6 h-6" />,
      features: [
        "Up to 10 users",
        "1,000 documents",
        "Basic AI search",
        "Email support",
        "5GB storage",
        "Standard security"
      ],
      notIncluded: [
        "Advanced AI features",
        "Real-time collaboration",
        "Custom integrations",
        "Priority support"
      ],
      popular: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional",
      description: "Ideal for growing teams and businesses",
      price: isAnnual ? 79 : 99,
      yearlyPrice: 948,
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Up to 50 users",
        "10,000 documents",
        "Advanced AI search & answers",
        "Real-time collaboration",
        "50GB storage",
        "Priority support",
        "Custom integrations",
        "Advanced analytics"
      ],
      notIncluded: [
        "Dedicated account manager",
        "Custom AI training",
        "SLA guarantee"
      ],
      popular: true,
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      description: "Complete solution for large organizations",
      price: "Custom",
      yearlyPrice: null,
      icon: <Building className="w-6 h-6" />,
      features: [
        "Unlimited users",
        "Unlimited documents",
        "Custom AI training",
        "Dedicated account manager",
        "Unlimited storage",
        "24/7 phone support",
        "Advanced security & compliance",
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment option"
      ],
      notIncluded: [],
      popular: false,
      buttonText: "Contact Sales"
    }
  ]

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "What happens if I exceed my limits?",
      answer: "We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional storage/users as needed."
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes, we offer a 50% discount for qualified non-profit organizations. Contact our sales team for more information."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption, regular security audits, and comply with GDPR, SOC 2, and other major compliance standards."
    },
    {
      question: "Can I try before I buy?",
      answer: "Yes! All plans come with a 14-day free trial. No credit card required to start your trial."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Pricing Plans</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Simple, Transparent
            <span className="text-primary"> Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the perfect plan for your team. Start with a free trial and scale as you grow.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Annual
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
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
                      Most Popular
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
            <h2 className="text-3xl font-bold mb-4">Compare Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Detailed comparison of all features across our plans.
            </p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Starter</th>
                      <th className="text-center py-3 px-4">Professional</th>
                      <th className="text-center py-3 px-4">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Users", starter: "10", professional: "50", enterprise: "Unlimited" },
                      { feature: "Documents", starter: "1,000", professional: "10,000", enterprise: "Unlimited" },
                      { feature: "Storage", starter: "5GB", professional: "50GB", enterprise: "Unlimited" },
                      { feature: "AI Search", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
                      { feature: "Support", starter: "Email", professional: "Priority", enterprise: "24/7 Phone" },
                      { feature: "Integrations", starter: "Basic", professional: "Custom", enterprise: "Unlimited" },
                      { feature: "Analytics", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
                      { feature: "SLA", starter: "No", professional: "No", enterprise: "99.9%" }
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
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Got questions? We've got answers.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of teams already using WikiAI to transform their knowledge management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
