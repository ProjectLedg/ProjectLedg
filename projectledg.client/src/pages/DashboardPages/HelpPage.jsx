import React, { useState } from 'react'
import { axiosConfig } from '/axiosconfig'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

const HelpPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState(null)

  const helpSections = [
    {
      id: "Hem",
      title: "Hem",
      content: "Hem sidan är din startsida där du kan se en översikt av dina senaste aktiviteter i bolaget. Du kan också anpassa din Dashboard för att visa de mättal och information som är viktigast för dig.",
      faqs: [
        { question: "Vad är lönsamhets poäng?", answer: "Din lönsamhets poäng är baserad på din beräknade vinstmarginal på ett normaliserat värde på 0-100. Där 50% vinst marginal motsvarar ett högt lönsamhets poäng och 0% vinstmarginal motsvarar ett lågt lönsamhets poäng." },
        { question: "Kan jag få ut andra mättal än dem i graferna?", answer: "Ja, Om det är så att man vill räkna ut andra mättal bortsett från dem som redan finns i graferna kan man ställa sin fråga till våran Ai. Vår Ai känner till alla dinna bokförningskonton, Verifikationer och fakturor och kan utifrån dem räkna ut dem mättal som önskas." },
      ]
    },
    {
      id: "Finasiell rapport",
      title: "Finasiell rapport",
      content: "Detta sidan är där du kan få rapporter för att analysera din bolags ekonomi utifrån balansräkningen och resultaträkningen.",
      faqs: [
        { question: "Hur generar jag resultaträkning & balansräkning?", answer: "Balansräkningen och resultat räkning uppdateras dynamikt, Vilket betyder att när du gör ändringar i din bokförning såsom att ta emot en ny faktura så uppdateras RR & BR automatiskt." },
        { question: "Kan jag exportera rapporten?", answer: "Nej, För tillfället går det ej att exportera rapporterna enskilt, Dock kommer både resultaträkningen och balansrapporten med när du generar din årsredovisning" },
      ]
    },
    {
      id: "Bokför",
      title: "Bokför",
      content: "Bokföringssidan är där du kan skanna in dina kvitton och ingående fakturor. Utifrån dinna fakturor och kvitton skapas verifikationer som sedan används för att generar din balansräkning och resultaträkning.",
      faqs: [
        { question: "Hur bokför jag en faktura?", answer: "För att bokföra en faktura, börjar man med att ladda upp fakturan, Sedan så läses den av och man kan bekräfta att allting kommit med på fakturan. Utifrån denna information skapas ett verifikations förslag som kan användas för att bokföra fakturan eller kvittot." },
        { question: "Kan man skapa verifikationer utan en faktura?", answer: "Ja, Det går att skapa en verifikation utan en faktura" },
      ]
    },
    {
      id: "Fakturering",
      title: "Fakturering",
      content: "Faktueringssidan är där du kan skapa, skicka och hantera fakturor för dina kunder.",
      faqs: [
        { question: "Kan jag spara en kund?", answer: "För tillfället fungerar det så att tidigare kunder som man har fakturerat sparas i hos ditt företag och det går att välja utifrån dem" },
        { question: "Kan jag skapa automatiska återkommande fakturor?", answer: "Nej, För tillfället går det inte att lägga till automatiserade fakturor." },
      ]
    },
    {
      id: "Årsredovisning",
      title: "Årsredovisning",
      content: "Årsredovisningssidan är där du kan generar din årsredovisning och ladda ner den i pdf format.",
      faqs: [
        { question: "Kan jag ladda ner Årsredovisningen i SIE-format?", answer: "Nej, För tillfället är det ej möjligt att ladda ner sin årsredovisning i SIE-format, Det är något som kommer komma framöver." },
        { question: "Stämmer verkligen denna årsredovisning?", answer: "Årsredovisningen följer K2-regelverket som gäller för mindre bolag där minst två av tre punkter inte uppnås. 80 miljoner omsättning, 50 anställda eller 60 miljoner i nettovinst." },
      ]
    },
  ]

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axiosConfig.post('/Email/create-help-message', formData)
      setFormStatus({ type: 'success', message: "Vi har tagit emot ditt meddelande och återkommer på mail så snart som möjligt" })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.log(error)
      setFormStatus({ type: 'error', message: "Det uppstog ett problem..." })
    }
  }

  const HelpSection = ({ title, content, faqs }) => (
    <div className="mt-4 space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
      <p className="text-sm sm:text-base">{content}</p>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-sm sm:text-base">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )

  return (
    <div className="container ">
      <Card className="w-full">
        <CardHeader className="space-y-1 sm:space-y-2">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">Hjälp</CardTitle>
          <CardDescription className="text-sm sm:text-base">Välkommen till hjälp centralen, Här finns svar & frågor samt möjlighet att lämna in en förfrågning</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={helpSections[0].id} className="w-full">
            <ScrollArea className=" whitespace-nowrap rounded-md border">
              <TabsList className="inline-flex justify-between w-full p-1 h-auto ">
                {helpSections.map((section) => (
                  <TabsTrigger key={section.id} value={section.id} className="text-xs min-w-36 sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 dark:bg-gray-800">
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            {helpSections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <HelpSection {...section} />
              </TabsContent>
            ))}
          </Tabs>
          
          <section className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">Skicka in en förfrågan?</h2>
            {formStatus && (
              <Alert className={`mb-4 ${formStatus.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                <AlertTitle className="text-sm sm:text-base">{formStatus.type === 'success' ? 'Skickat' : 'Fel'}</AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">{formStatus.message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Namn</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Ditt namn" className="text-sm sm:text-base" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Din email" className="text-sm sm:text-base" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="message" className="text-sm sm:text-base">Meddelande</Label>
                <Textarea id="message" value={formData.message} onChange={handleInputChange} placeholder="Beskriv problemet eller feedbacken du har!" className="text-sm sm:text-base" />
              </div>
              <Button type="submit" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-sm sm:text-base">Skicka meddelande</Button>
            </form>
          </section>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <Button variant="link" className="w-full sm:w-auto text-sm sm:text-base">Användar guide</Button>
          <Button variant="link" className="w-full sm:w-auto text-sm sm:text-base">Video genomgång</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default HelpPage