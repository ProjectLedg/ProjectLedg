import React, { useState } from 'react'
import { axiosConfig } from '/axiosconfig'
import { Card, CardContent} from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from 'react-router-dom'
import {
  Home,
  Activity,
  BookCheck,
  BookDown,
  FileText,
} from "lucide-react";


const HelpPage = () => {
  const { companyId } = useParams();

  // Mappning för kategorier till deras respektive index
  const categoryMapping = {
    Tekniskt: 0,
    Betalning: 1,
    Konto: 2,
    Generellt: 3,
    Produktärende: 4,
    Feedback: 5,
    Annat: 6,
  };

  const [formData, setFormData] = useState({
    category: 'Technical', // default value
    subject: '',
    description: '',
    companyId, // Assign directly from params
    image: null,
  });
  const [formStatus, setFormStatus] = useState(null);


  const helpSections = [
    {
      id: "Hem",
      title: "Hem",
      icon: <Home />,
      content: "Hem sidan är din startsida där du kan se en översikt av dina senaste aktiviteter i bolaget. Du kan också anpassa din Dashboard för att visa de mättal och information som är viktigast för dig.",
      faqs: [
        { question: "Vad är lönsamhets poäng?", answer: "Din lönsamhets poäng är baserad på din beräknade vinstmarginal på ett normaliserat värde på 0-100. Där 50% vinst marginal motsvarar ett högt lönsamhets poäng och 0% vinstmarginal motsvarar ett lågt lönsamhets poäng." },
        { question: "Kan jag få ut andra mättal än dem i graferna?", answer: "Ja, Om det är så att man vill räkna ut andra mättal bortsett från dem som redan finns i graferna kan man ställa sin fråga till våran Ai. Vår Ai känner till alla dinna bokförningskonton, Verifikationer och fakturor och kan utifrån dem räkna ut dem mättal som önskas." },
      ]
    },
    {
      id: "Finansiell rapport",
      title: "Finansiell rapport",
      icon: <Activity />,
      content: "Detta sidan är där du kan få rapporter för att analysera din bolags ekonomi utifrån balansräkningen och resultaträkningen.",
      faqs: [
        { question: "Hur generar jag resultaträkning & balansräkning?", answer: "Balansräkningen och resultat räkning uppdateras dynamikt, Vilket betyder att när du gör ändringar i din bokförning såsom att ta emot en ny faktura så uppdateras RR & BR automatiskt." },
        { question: "Kan jag exportera rapporten?", answer: "Nej, För tillfället går det ej att exportera rapporterna enskilt, Dock kommer både resultaträkningen och balansrapporten med när du generar din årsredovisning" },
      ]
    },
    {
      id: "Bokför",
      title: "Bokför",
      icon: <BookCheck />,
      content: "Bokföringssidan är där du kan skanna in dina kvitton och ingående fakturor. Utifrån dinna fakturor och kvitton skapas verifikationer som sedan används för att generar din balansräkning och resultaträkning.",
      faqs: [
        { question: "Hur bokför jag en faktura?", answer: "För att bokföra en faktura, börjar man med att ladda upp fakturan, Sedan så läses den av och man kan bekräfta att allting kommit med på fakturan. Utifrån denna information skapas ett verifikations förslag som kan användas för att bokföra fakturan eller kvittot." },
        { question: "Kan man skapa verifikationer utan en faktura?", answer: "Ja, Det går att skapa en verifikation utan en faktura" },
      ]
    },
    {
      id: "Fakturering",
      title: "Fakturering",
      icon: <FileText />,
      content: "Faktueringssidan är där du kan skapa, skicka och hantera fakturor för dina kunder.",
      faqs: [
        { question: "Kan jag spara en kund?", answer: "För tillfället fungerar det så att tidigare kunder som man har fakturerat sparas i hos ditt företag och det går att välja utifrån dem" },
        { question: "Kan jag skapa automatiska återkommande fakturor?", answer: "Nej, För tillfället går det inte att lägga till automatiserade fakturor." },
      ]
    },
    {
      id: "Årsredovisning",
      title: "Årsredovisning",
      icon: <BookDown />,
      content: "Årsredovisningssidan är där du kan generar din årsredovisning och ladda ner den i pdf format.",
      faqs: [
        { question: "Kan jag ladda ner Årsredovisningen i SIE-format?", answer: "Nej, För tillfället är det ej möjligt att ladda ner sin årsredovisning i SIE-format, Det är något som kommer komma framöver." },
        { question: "Stämmer verkligen denna årsredovisning?", answer: "Årsredovisningen följer K2-regelverket som gäller för mindre bolag där minst två av tre punkter inte uppnås. 80 miljoner omsättning, 50 anställda eller 60 miljoner i nettovinst." },
      ]
    },
  ]


  const [activeTab, setActiveTab] = useState(helpSections[0].id);

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mappa kategorin från string till motsvarande nummer
    const categoryMapping = {
      Technical: 0,
      Billing: 1,
      AccountManagement: 2,
      GeneralInquiry: 3,
      ProductSupport: 4,
      Feedback: 5,
      NothingRelevant: 6,
    };

    // Skapa JSON-payloaden
    const payload = {
      category: categoryMapping[formData.category],
      subject: formData.subject,
      description: formData.description,
      companyId: parseInt(formData.companyId, 10),
      image: formData.image ? await toBase64(formData.image) : null, // Konvertera bilden till base64 om den finns
    };

    try {
      // Skicka JSON-payload
      await axiosConfig.post('/SupportTickets', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setFormStatus({ type: 'success', message: "Ditt supportärende har skickats!" });
      // Återställ formuläret
      setFormData({ category: 'Technical', subject: '', description: '', companyId, image: null });

    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus({ type: 'error', message: "Det uppstod ett problem med att skicka ärendet." });
    }
  };

  // Helper för att konvertera bildfil till base64-sträng
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


  const HelpSection = ({ title, content, faqs }) => (
    <div className="mt-4 space-y-2">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-8">{title}</h2>
        <div className="h-auto ">
          <p className="text-md">{content}</p>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full ">
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
    <div className="space-b-4 p-4">


      {/* Tabs outside the Card */}
      <div className="w-full space-y-4 ">
        <h1 className="text-3xl mb-7 font-bold">Hjälp</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
          <ScrollArea className="whitespace-nowrap rounded-md ">
            <TabsList className="inline-flex justify-between w-full p-1 h-auto dark:bg-darkBackground ">
              {helpSections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="text-sm lg:min-w-36 font-semibold dark:bg-darkBackground"
                >
                  {section.icon}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Card with TabsContent inside */}
      <Card className="w-full mt-2 mb-6">
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {helpSections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <HelpSection {...section} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <section className="mt-6 ">
            <h2 className="text-xl  md:text-2xl font-semibold mb-8">Skapa ett Supportärende</h2>
            {formStatus && (
              <Alert
                className={`mb-4 ${formStatus.type === "success" ? "bg-green-100" : "bg-red-100"
                  }`}
              >
                <AlertTitle className="text-sm sm:text-base">
                  {formStatus.type === "success" ? "Skickat" : "Fel"}
                </AlertTitle>
                <AlertDescription className="text-xs sm:text-sm">
                  {formStatus.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
    <Label htmlFor="category" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
      Kategori
    </Label>
    <div className="relative">
      <select
        id="category"
        value={formData.category}
        onChange={handleInputChange}
        className="block w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-darkBackground text-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:cursor-pointer"
      >
        {Object.keys(categoryMapping).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      
    </div>
  </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="subject" className="text-sm sm:text-base">
                  Ärende
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Ärendets titel"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">
                  Beskrivning
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Beskriv problemet"
                  className="text-sm sm:text-base placeholder:dark:text-darkSecondary"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="image" className="text-sm sm:text-base">
                  Bild (valfritt)
                </Label>
                <Input
                  id="image"
                  type="file"
                  onChange={handleFileChange}
                  className="text-sm sm:text-base  cursor-pointer"
                />
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 dark:text-white text-sm sm:text-base "
              >
                Skicka supportärende
              </Button>
            </form>
          </section>
        </CardContent>
      {/*   <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <Button
            variant="link"
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Användarguide
          </Button>
          <Button
            variant="link"
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Videogenomgång
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );

}

export default HelpPage
