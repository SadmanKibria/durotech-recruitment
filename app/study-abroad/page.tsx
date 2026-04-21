"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Globe,
  BookOpen,
  CheckCircle,
  Loader2,
  Upload,
  FileText,
  Award,
  Building2,
  Plane,
  Heart,
} from "lucide-react"

export default function StudyAbroadPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    educationLevel: "",
    programInterest: "",
    preferredCountry: "",
    budget: "",
    startDate: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Submit to API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSuccess(true)
    setLoading(false)
  }

  const destinations = [
    {
      country: "Poland",
      flag: "🇵🇱",
      universities: ["WSN University", "UFM University", "Vistula University"],
      programs: "Engineering, Business, IT",
    },
    {
      country: "Albania",
      flag: "🇦🇱",
      universities: ["WBU University"],
      programs: "Business, Economics",
    },
    {
      country: "Malta",
      flag: "🇲🇹",
      universities: ["International European University", "LVI Malta", "ECI College"],
      programs: "Business, Engineering, Arts",
    },
    {
      country: "Ireland",
      flag: "🇮🇪",
      universities: ["Dublin City University", "International College of Technology", "Dublin Business School"],
      programs: "IT, Pharmacy, Business",
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      universities: ["University of East London", "University of Greenwich", "Coventry University", "University of Bedfordshire", "University of Cumbria", "London Metropolitan University"],
      programs: "Engineering, Medicine, Business",
    },
  ]

  const services = [
    {
      icon: BookOpen,
      title: "University Selection",
      description: "Expert guidance to choose the right university and program",
    },
    {
      icon: FileText,
      title: "Application Support",
      description: "Complete assistance with applications and documentation",
    },
    {
      icon: Award,
      title: "Scholarship Guidance",
      description: "Help finding and applying for scholarships and financial aid",
    },
    { icon: Plane, title: "Visa Assistance", description: "End-to-end support for student visa applications" },
    { icon: Building2, title: "Accommodation", description: "Help finding safe and affordable student housing" },
    { icon: Heart, title: "Pre-departure Support", description: "Orientation and preparation for life abroad" },
  ]

  const stats = [
    { value: "5,000+", label: "Students Placed" },
    { value: "200+", label: "Partner Universities" },
    { value: "15+", label: "Countries" },
    { value: "95%", label: "Visa Success Rate" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#1E3A5F] py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5C547]/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-[#F5C547] text-[#1E3A5F] hover:bg-[#F5C547]/90 mb-4">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Study Abroad Programs
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  Your Journey to
                  <span className="text-[#F5C547]"> World-Class Education</span>
                </h1>
                <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                  Durotech Recruitment helps ambitious students achieve their dreams of studying at top universities
                  worldwide. From application to arrival, we're with you every step of the way.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="h-12 px-6 bg-[#F5C547] text-[#1E3A5F] hover:bg-[#F5C547]/90">
                    <a href="#apply">
                      <GraduationCap className="mr-2 h-5 w-5" />
                      Apply Now
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 border-slate-500 text-white hover:bg-slate-800 bg-transparent"
                  >
                    <a href="#destinations">
                      <Globe className="mr-2 h-5 w-5" />
                      Explore Destinations
                    </a>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#F5C547]/20 rounded-3xl blur-2xl" />
                  <Image
                    src="/diverse-students-graduation-university-campus.jpg"
                    alt="Students at graduation"
                    width={500}
                    height={400}
                    className="relative rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our Study Abroad Services</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Comprehensive support to make your international education journey smooth and successful
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section id="destinations" className="py-16 md:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Popular Study Destinations</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Choose from top universities in the world's most sought-after education destinations
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((dest) => (
                <Card key={dest.country} className="hover:shadow-lg transition-all hover:border-primary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{dest.flag}</span>
                      <div>
                        <CardTitle className="text-lg">{dest.country}</CardTitle>
                        <CardDescription>{dest.universities.length} Top Universities</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Featured Universities:</p>
                        <ul className="space-y-1">
                          {dest.universities.map((uni) => (
                            <li key={uni} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              {uni}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-muted-foreground pt-2 border-t">
                        <span className="font-medium text-foreground">Programs:</span> {dest.programs}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" className="py-16 md:py-20 bg-secondary/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Start Your Application</CardTitle>
                <CardDescription>
                  Fill out the form below and our education consultants will contact you within 48 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Application Submitted!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your interest. Our education consultants will contact you within 48 hours.
                    </p>
                    <Button
                      onClick={() => {
                        setSuccess(false)
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          nationality: "",
                          educationLevel: "",
                          programInterest: "",
                          preferredCountry: "",
                          budget: "",
                          startDate: "",
                          message: "",
                        })
                      }}
                    >
                      Submit Another Application
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
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
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
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+44 7700 900000"
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          placeholder="e.g., British"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="educationLevel">Current Education Level</Label>
                        <Select
                          value={formData.educationLevel}
                          onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high-school">High School</SelectItem>
                            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                            <SelectItem value="masters">Master's Degree</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="programInterest">Program of Interest</Label>
                        <Select
                          value={formData.programInterest}
                          onValueChange={(value) => setFormData({ ...formData, programInterest: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="postgraduate">Postgraduate</SelectItem>
                            <SelectItem value="mba">MBA</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="language">Language Course</SelectItem>
                            <SelectItem value="foundation">Foundation Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredCountry">Preferred Country</Label>
                        <Select
                          value={formData.preferredCountry}
                          onValueChange={(value) => setFormData({ ...formData, preferredCountry: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="germany">Germany</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="ireland">Ireland</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Preferred Start Date</Label>
                        <Select
                          value={formData.startDate}
                          onValueChange={(value) => setFormData({ ...formData, startDate: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select intake" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025-jan">January 2025</SelectItem>
                            <SelectItem value="2025-sep">September 2025</SelectItem>
                            <SelectItem value="2026-jan">January 2026</SelectItem>
                            <SelectItem value="2026-sep">September 2026</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your educational background, goals, and any specific requirements..."
                        rows={4}
                        disabled={loading}
                      />
                    </div>

                    <Button type="submit" className="w-full h-12" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
