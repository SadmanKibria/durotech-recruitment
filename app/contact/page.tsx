import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const offices = [
    {
      city: "London (HQ)",
      address: "123 Recruitment Street, London, EC1A 1BB, United Kingdom",
      phone: "+44 20 1234 5678",
      email: "london@durotechrecruitment.com",
    },
    {
      city: "Dubai",
      address: "Business Bay Tower, Floor 15, Dubai, UAE",
      phone: "+971 4 123 4567",
      email: "dubai@durotechrecruitment.com",
    },
    {
      city: "Singapore",
      address: "Marina Bay Financial Centre, Singapore 018983",
      phone: "+65 6123 4567",
      email: "singapore@durotechrecruitment.com",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-foreground py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-background">Contact Us</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Have questions about our services or want to discuss your recruitment needs? Our team is here to help.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {offices.map((office) => (
                <Card key={office.city}>
                  <CardHeader>
                    <CardTitle>{office.city}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#0066cc] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[#0066cc]" />
                      <span className="text-sm text-muted">{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-[#0066cc]" />
                      <span className="text-sm text-muted">{office.email}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>General Inquiries</CardTitle>
                <CardDescription>For general questions or partnership opportunities</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#0066cc]" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted">info@durotechrecruitment.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#0066cc]" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted">+44 20 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#0066cc]" />
                  <div>
                    <p className="text-sm font-medium">Business Hours</p>
                    <p className="text-sm text-muted">Mon-Fri, 9AM-6PM GMT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
