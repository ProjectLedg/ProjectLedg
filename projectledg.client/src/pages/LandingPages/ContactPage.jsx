import React, { useState } from "react"
import axios from "axios"
import Navbar from "./LandingPageComp/Navbar"
import FooterSection from "./LandingPageComp/FooterSection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Loader2, Sparkles } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const contactInfo = [
    { icon: <Mail className="h-5 w-5 text-green-500" />, text: "ProjectLedg@gmail.com" },
    { icon: <Phone className="h-5 w-5 text-green-500" />, text: "+46 123 456 789" },
    { icon: <MapPin className="h-5 w-5 text-green-500" />, text: "Stockholm, Sweden" },
  ]

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await axios.post("https://localhost:7223/api/Email/SendEmail", formData)
      if (response.status === 200) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="mt-24">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Kontakta oss</h1>
          <p className="text-center mb-12 text-gray-600">
            Vänligen fyll i formuläret nedan eller använd vår kontaktinformation.
          </p>
          <div className="grid md:grid-cols-2 gap-8 justify-center">
            <Card className="bg-white shadow-lg border-green-500 border-2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-between">
                  Skicka ett meddelande till oss
                  <Sparkles className="h-5 w-5 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Namn</label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ditt namn"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-post</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Din e-postadress"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Meddelande</label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Ditt meddelande"
                      className="mt-1"
                      rows={4}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full transition-colors duration-300 bg-green-500 hover:bg-green-600 text-white rounded-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Skickar...
                      </>
                    ) : (
                      "Skicka meddelande"
                    )}
                  </Button>
                  {submitStatus === "success" && (
                    <p className="text-green-600 text-center mt-2">Meddelandet har skickats!</p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-red-600 text-center mt-2">Det gick inte att skicka meddelandet. Vänligen försök igen.</p>
                  )}
                </form>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg border-green-500 border-2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-between">
                  Kontaktinformation
                  <Sparkles className="h-5 w-5 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {item.icon}
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}