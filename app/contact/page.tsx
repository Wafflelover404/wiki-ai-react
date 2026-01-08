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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Handle form submission here
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactOptions = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Email Support",
      description: "Get help with your account, billing, or general questions",
      email: "info.wikiai@gmail.com",
      phone: null,
      hours: "24/7 Support"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our support team",
      email: null,
      phone: "+375 297 345 682",
      hours: "Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Telegram Support",
      description: "Join our Telegram community for quick help",
      email: null,
      phone: null,
      hours: "Community Support",
      telegram: "https://t.me/vikigolubeva"
    }
  ]

  const offices = [
    {
      city: "Global Support",
      address: "Serving customers worldwide\n24/7 Email Support",
      phone: "+375 297 345 682",
      isHQ: true
    },
    {
      city: "Community",
      address: "Join our Telegram community\nGet help from other users",
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
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Get in
            <span className="text-primary"> Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about WikiAI? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
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
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>

            {/* Company Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">WikiAI Inc.</h2>
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Global Support
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Serving customers worldwide</p>
                      <p><a href="mailto:info.wikiai@gmail.com" className="text-primary hover:underline">info.wikiai@gmail.com</a></p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-primary" />
                      Phone Support
                    </h3>
                    <div className="space-y-2">
                      <p><a href="tel:+375297345682" className="text-primary hover:underline">+375 297 345 682</a></p>
                      <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Community
                    </h3>
                    <div className="space-y-2">
                      <p><a href="https://t.me/vikigolubeva" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Join our Telegram</a></p>
                      <p className="text-sm text-muted-foreground">Get help from our community</p>
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
            <h2 className="text-3xl font-bold mb-4">Our Offices</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find us around the world. We're always happy to connect in person.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold">{office.city}</h3>
                    {office.isHQ && (
                      <Badge variant="secondary">HQ</Badge>
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
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Check out our FAQ section for quick answers to common questions.
          </p>
          <Button size="lg">
            View FAQ
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
