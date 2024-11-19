import { ArrowRight, BookOpen, Clock, PieChart, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CallToAction() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ">
      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight first:mt-0 mb-16">
          Vi gör det lättare
        </h2>
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Enkel, snabb och användbar bokföring med Ledge
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2">
              Precis som bokföring borde vara
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              Ledge är den kompletta plattformen för småföretagare – automatiserad bokföring som håller dina böcker uppdaterade och korrekta med kraften av AI.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <FeatureCard
                icon={<BookOpen className="h-6 w-6" />}
                title="AI-driven bokföring"
                description="Automatisk bokföring av transaktioner så att du kan se hur ditt bolag går i realtid."
              />
              <FeatureCard
                icon={<PieChart className="h-6 w-6" />}
                title="Interaktiva rapporter"
                description="Generera interaktiva rapporter och få värdefulla insikter på sekunder."
              />
              <FeatureCard
                icon={<FileCheck className="h-6 w-6" />}
                title="Deklarationshjälp"
                description="Hjälp genom hela processen för årsredovisning, momsdeklaration och inkomstdeklaration."
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="24/7 Assistans (Beta)"
                description="Stöd från riktiga revisorer när AI behöver extra hjälp."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Boka en Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}