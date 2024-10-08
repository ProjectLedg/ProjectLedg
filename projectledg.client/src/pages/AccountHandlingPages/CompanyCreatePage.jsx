import { useLocation } from 'react-router-dom'
import React, { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const initialFields = [
  { id: 'firstName', label: 'Förrnamn', type: 'text', placeholder: 'John' },
  { id: 'lastName', label: 'Efternamn', type: 'text', placeholder: 'Doe' },
  { id: 'companyName', label: 'Företagsnamn', type: 'text', placeholder: 'Acme Inc.' },
]

export default function CompanyCreatePage() {
  
  const [formData, setFormData] = useState({})

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300 backdrop-blur-md p-4">
      <Card className="w-full max-w-md shadow-lg"> Wwd
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sätt upp Företag</CardTitle>
          <CardDescription>För in företags information </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {initialFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  type={field.type}
                  id={field.id}
                  placeholder={field.placeholder}
                  onChange={handleInputChange}
                  value={formData[field.id] || ''}
                  className="w-full"
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}