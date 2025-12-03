"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, Globe, Users, Building2 } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSuccess(true)
    setLoading(false)
  }

  const offices = [
    {
      city: "London (HQ)",
      region: "Europe",
      address: "123 Recruitment Street, London, EC1A 1BB, United Kingdom",
      phone: "+44 20 1234 5678",
      email: "london@durotechrecruitment.com",
    },
    {
      city: "Dubai",
      region: "Middle East",
      address: "Business Bay Tower, Floor 15, Dubai, UAE",
      phone: "+971 4 123 4567",
      email: "dubai@durotechrecruitment.com",
    },
    {
      city: "Singapore",
      region: "Asia",
      address: "Marina Bay Financial Centre, Singapore 018983",
      phone: "+65 6123 4567",
      email: "singapore@durotechrecruitment.com",
    },
  ]

  const inquiryTypes = [
    { value: "job-seeker", label: "I'm looking for a job" },
    { value: "employer", label: "I want to hire talent" },
    { value: "partnership", label: "Partnership inquiry" },
    { value: "general", label: "General question" },
    { value: "complaint", label: "Complaint or feedback" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">Get in Touch</h1>
              <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                Have questions about our services or want to discuss your recruitment needs? Our global team is here to
                help you succeed.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-sm text-slate-400">Global Offices</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-sm text-slate-400">Support Available</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-slate-400">Partner Companies</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {success ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-6">
                          Thank you for reaching out. Our team will get back to you shortly.
                        </p>
                        <Button
                          onClick={() => {
                            setSuccess(false)
                            setFormData({ name: "", email: "", phone: "", subject: "", inquiryType: "", message: "" })
                          }}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">
                              Email Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+44 7700 900000"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inquiryType">Inquiry Type</Label>
                            <Select
                              value={formData.inquiryType}
                              onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {inquiryTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="How can we help you?"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">
                            Message <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us more about your inquiry..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            disabled={loading}
                          />
                        </div>

                        <Button type="submit" className="w-full h-12" disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>General Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">info@durotechrecruitment.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">+44 20 1234 5678</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Hours</p>
                        <p className="font-medium">Mon-Fri, 9AM-6PM GMT</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground bg-white rounded-xl p-4 shadow-lg border-0">
                  <p className="font-medium text-foreground mb-2">Response Time</p>
                  <p>
                    We aim to respond to all inquiries within 24 business hours. For urgent matters, please call our
                    main office.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Our Global Offices</h2>
              <p className="mt-3 text-muted-foreground">Visit us at any of our locations across three continents</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {offices.map((office) => (
                <Card key={office.city} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{office.city}</CardTitle>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        {office.region}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{office.email}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
