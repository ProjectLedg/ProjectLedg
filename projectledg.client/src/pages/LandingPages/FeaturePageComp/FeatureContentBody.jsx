import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

// const FeatureContentBody = () => {
//     return (
//         <div>

//         </div>
//     )
// }

export default function FeatureContentBody() {
    const steps = [
        {
            "number": "01",
            "title": "Automatiserad Bokföring med AI",
            "description": "Automatisera hanteringen av fakturor, kvitton och transaktioner med hjälp av AI. Vår lösning gör det enkelt att hålla bokföringen uppdaterad och korrekt i realtid."
        },
        {
            "number": "02",
            "title": "Ekonomisk Översikt och Statistik",
            "description": "Få en tydlig bild av ditt företags ekonomiska utveckling. Följ resultat och analyser för att fatta bättre beslut och hålla din verksamhet på rätt spår."
        },
        {
            "number": "03",
            "title": "Generera Årsredovisning",
            "description": "Skapa din årsredovisning på några sekunder med vår automatiserade funktion. All data samlas och struktureras enligt aktuella standarder."
        },
        {
            "number": "04",
            "title": "Balans- och Resultaträkning",
            "description": "Få fullständig kontroll över ditt företags finansiella status. Våra balanserade rapporter hjälper dig att analysera tillgångar, skulder och vinster."
        }

    ]

    return (
        <>
            <div className="w-full p-8 bg-white/60 bg-opacity-80 shadow-lg rounded-[1.5rem]">
                <div className=" mx-auto  ">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center text-gray-700">
                        Smidiga Tjänster för Din Ekonomiska Framgång
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                        {steps.map((step, index) => (
                            <Card key={index} className="border-0 shadow-none bg-white shadow-md shadow-green-200">
                                <CardContent className="p-3 ">
                                    <div className="flex flex-col space-y-2">
                                        <span className="text-4xl font-bold text-green-500 ">{step.number}</span>
                                        <h2 className="text-2xl font-semibold text-gray-700">{step.title}</h2>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full p-6"></div>
        </>
    );
}
