import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const FeatureCard = ({ number, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="h-full bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-900 dark:to-teal-800 border-none shadow-lg">
      <CardContent className="p-6">
        <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-200 dark:bg-gree -800 rounded-full">
          {number}
        </span>
        <h2 className="text-2xl font-bold mb-3 text-green-800 dark:text-green-100">{title}</h2>
        <p className="text-green-700 dark:text-green-200">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

const steps = [
  {
    number: "01",
    title: "Automatiserad Bokföring med AI",
    description: "Automatisk bokföring av transaktioner så att du kan se hur ditt bolag går i realtid."
  },
  {
    number: "02",
    title: "Ekonomisk Översikt och Statistik",
    description: "Få en tydlig bild av ditt företags ekonomiska utveckling. Följ resultat och analyser för att fatta bättre beslut och hålla din verksamhet på rätt spår."
  },
  {
    number: "03",
    title: "Generera Årsredovisning",
    description: "Skapa din årsredovisning på några sekunder med vår automatiserade funktion. All data samlas och struktureras enligt aktuella standarder."
  },
  {
    number: "04",
    title: "Balans- och Resultaträkning",
    description: "Få fullständig kontroll över ditt företags finansiella status. Våra balanserade rapporter hjälper dig att analysera tillgångar, skulder och vinster."
  }
]

export default function FeatureContentBody() {
  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-100 dark:from-gray-900 dark:to-green-700 rounded-t-2xl">
      <div className="max-w-7xl mx-auto ">
        <div className=''>
        <h1 className="text-2xl h-[8rem] sm:text-4xl lg:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300">
          Smidiga Tjänster för Din Ekonomiska Framgång
        </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <FeatureCard key={index} {...step} />
          ))}
        </div>
      </div>
    </div>
  )
}