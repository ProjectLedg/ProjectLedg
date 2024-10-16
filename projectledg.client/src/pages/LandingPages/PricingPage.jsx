import React from "react"
import Navbar from "./LandingPageComp/Navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Lock, Sparkles } from "lucide-react"
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const tiers = [
    {
      name: "Gratis",
      price: "0 sek ",
      description: "Detta är en demo version av Ledge",
      features: ["Ai Bokföring", "Årsredovisning, BR & RR","Ekonomi översikt"],
      cta: "Starta nu",
      locked: false,
    },
    {
      name: "Pro",
      price: "200 sek ",
      description: "Lås upp avancerade funktioner (Kommer snart)",
      features: ["Avancerade funktioner", "Ökad lagring", "Prioriterad support"],
      cta: "Kommer snart",
      locked: true,
    },
    {
      name: "Enterprise",
      price: "Anpassat ",
      description: "För stora företag och entrepenader (Kommer snart)",
      features: ["Anpassade funktioner", "Obegränsad lagring", "Dedikerad support"],
      cta: "Kommer snart",
      locked: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-green-500">Choose Your Plan</h1>
        <p className="text-center mb-12 text-gray-600">
          We're currently in alpha. More options coming soon!
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {tiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`transform transition-all duration-300 hover:scale-105 max-w-sm ${
                tier.locked ? "bg-gray-50" : "bg-white shadow-lg border-green-500 border-2"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {tier.name}
                  {tier.locked ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-4 text-green-500">{tier.price}
                  <span className="text-sm font-normal text-gray-600">/månad</span>
                </p>
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span className={tier.locked ? "text-gray-400" : "text-gray-700"}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.locked ? (
                  <Button 
                    className="w-full transition-colors duration-300 bg-gray-300 text-gray-600"
                    disabled
                  >
                    {tier.cta}
                  </Button>
                ) : (
                  <Button 
                    className="w-full transition-colors duration-300 bg-green-500 hover:bg-green-600 text-white"
                    asChild
                  >
                    <Link to="/signup">{tier.cta}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default PricingPage