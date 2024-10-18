import React from "react"
import Navbar from "./LandingPageComp/Navbar"
import FooterSection from "./LandingPageComp/FooterSection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function VarforPage() {
  const reasons = [
    {
      title: "Innovativ Teknik",
      description: "Vår banbrytande lösning utnyttjar de senaste framstegen inom området."
    },
    {
      title: "Användarvänligt Gränssnitt",
      description: "Intuitiv design som gör komplexa uppgifter enkla och effektiva."
    },
    {
      title: "Skalbar Lösning",
      description: "Växer med ditt företag, från startups till verksamheter på företagsnivå."
    },
    {
      title: "Support Dygnet Runt",
      description: "Stöd dygnet runt för att säkerställa din framgång och tillfredsställelse."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <section className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-4">Varför Välja Oss?</h1>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Vår lösning sticker ut från konkurrensen och erbjuder enastående värde och innovation för att möta dina behov.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reasons.map((reason, index) => (
              <Card key={index} className="border-l-4 border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                    {reason.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-8 shadow-lg max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Stärka Din Framgång</h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <p className="text-lg mb-4">
                Vårt engagemang går längre än att bara tillhandahålla en lösning. Vi är dedikerade till att stärka din framgång varje steg på vägen. Med vår innovativa teknik och oöverträffade support får du verktyg och resurser för att:
              </p>
              <ul className="space-y-2">
                {["Effektivisera dina operationer", "Öka produktiviteten", "Främja tillväxt", "Hålla dig före konkurrenterna"].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="./src/assets/landingpage-icons/LonsamhetIcon.png"
                alt="Illustration av Framgång"
                className="rounded-lg shadow-md"
                width={300}
                height={300}
              />
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
