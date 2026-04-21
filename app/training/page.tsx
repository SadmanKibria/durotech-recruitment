"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Award,
  Users,
  Briefcase,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Heart,
} from "lucide-react"
export default function TrainingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const carouselSlides = [
    {
      title: "Professional Training",
      description:
        "Develop industry-recognized skills and certifications to advance your career in healthcare, technology, and more.",
      icon: BookOpen,
      gradient: "from-blue-600 to-blue-400",
      link: "#training",
    },
    {
      title: "Employment Opportunities",
      description:
        "After completing your training, access exclusive job placements with leading employers across Europe and beyond.",
      icon: Briefcase,
      gradient: "from-purple-600 to-purple-400",
      link: "/jobs",
    },
    {
      title: "Study Abroad Programs",
      description:
        "Pursue higher education at prestigious universities in Poland, Malta, Ireland, UK, Albania, and more.",
      icon: GraduationCap,
      gradient: "from-emerald-600 to-emerald-400",
      link: "/study-abroad",
    },
  ]

  const trainingPrograms = [
    {
      category: "Healthcare",
      programs: [
        "Health and Social Care Level 2 & 3",
        "Nursing Assistant Training",
        "Elderly Care Certification",
        "Mental Health Support Worker",
        "Care Quality Commission Compliance",
      ],
    },
    {
      category: "Technology & Cyber",
      programs: [
        "IT Fundamentals & CompTIA A+",
        "Cyber Security Foundation",
        "Cybersecurity Professional Certification",
        "Network Administration",
        "Data Security & Compliance",
      ],
    },
    {
      category: "Professional Development",
      programs: [
        "Early Years Teaching & Childcare",
        "Apprenticeships in Cyber Security",
        "Apprenticeships in IT",
        "Apprenticeships in Health & Social Care",
        "Accounting & Finance Fundamentals",
      ],
    },
    {
      category: "Life Skills",
      programs: [
        "English Language for Work",
        "Leadership & Management",
        "Communication Skills",
        "Workplace Health & Safety",
        "Customer Service Excellence",
      ],
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Carousel Hero */}
        <section className="relative bg-gradient-to-b from-[#1E3A5F] to-[#2C5282] py-20 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[400px]">
                {/* Carousel Content */}
                <div className="flex flex-col justify-center">
                  <div className="space-y-6">
                    <Badge className="w-fit bg-[#F5C547] text-[#1E3A5F]">
                      Professional Growth
                    </Badge>
                    <div className="min-h-32">
                      <h1 className="text-4xl md:text-5xl font-bold text-white text-balance">
                        {carouselSlides[currentSlide].title}
                      </h1>
                      <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                        {carouselSlides[currentSlide].description}
                      </p>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        asChild
                        size="lg"
                        className="bg-[#F5C547] text-[#1E3A5F] hover:bg-[#F5C547]/90"
                      >
                        <Link href={carouselSlides[currentSlide].link}>
                          Learn More
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center gap-4 mt-8">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex gap-2">
                      {carouselSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentSlide ? "bg-[#F5C547] w-8" : "bg-white/30 w-2"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Carousel Visual */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className={`w-full h-80 rounded-2xl bg-gradient-to-br ${carouselSlides[currentSlide].gradient} flex items-center justify-center transform transition-all duration-500`}>
                    {(() => {
                      const IconComponent = carouselSlides[currentSlide].icon
                      return <IconComponent className="h-32 w-32 text-white opacity-50" />
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Programs Section */}
        <section id="training" className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#F5C547] uppercase tracking-wider">Our Offerings</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">Professional Training Programs</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                We offer comprehensive training across healthcare, technology, and professional development
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainingPrograms.map((category) => (
                <Card key={category.category} className="border-2 border-slate-200 hover:border-[#F5C547] hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-[#F5C547]/20 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-[#F5C547]" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">{category.category}</h3>
                    <ul className="space-y-3">
                      {category.programs.map((program) => (
                        <li key={program} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{program}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#F5C547] uppercase tracking-wider">Why Train With Us</span>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Benefits of Our Programs</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#F5C547]/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-[#F5C547]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Industry-Recognized</h3>
                <p className="text-sm text-muted-foreground">
                  All certifications are recognized by employers across Europe and beyond
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#F5C547]/20 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-[#F5C547]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Expert Trainers</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from experienced professionals with real-world industry experience
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#F5C547]/20 flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-[#F5C547]" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Job Placement</h3>
                <p className="text-sm text-muted-foreground">
                  Access exclusive employment opportunities after completing your training
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#1E3A5F] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">
              Ready to Advance Your Career?
            </h2>
            <p className="mt-4 text-blue-100 max-w-2xl mx-auto text-lg">
              Join thousands of professionals who have transformed their careers through our training programs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                asChild
                size="lg"
                className="bg-[#F5C547] text-[#1E3A5F] hover:bg-[#F5C547]/90"
              >
                <Link href="/contact">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
