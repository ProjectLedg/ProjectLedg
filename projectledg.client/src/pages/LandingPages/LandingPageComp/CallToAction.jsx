import React from 'react'
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-center mb-4">
              Upptäck kraften i vår innovativa lösning
            </h2>
            <p className="text-center text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Vår produkt revolutionerar hur du hanterar ditt företag. Spara tid, öka produktiviteten och nå dina mål snabbare än någonsin.

            </p>
            <div className="flex justify-center">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
                onClick={() => navigate("/features")}
              >
                Utforska våra lösningar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}