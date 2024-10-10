import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import axiosConfig from '/axiosconfig'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"


const initialFields = [
  { id: 'companyName', label: 'Företagsnamn', type: 'text', placeholder: 'Företagsnamn' },
  { id: 'orgNumber', label: 'Orgnummer', type: 'text', placeholder: 'Orgnummer' },
  { id: 'amountOfEmployees', label: 'Antal anställda', type: 'number', placeholder: '0' },
]

export default function CompanyCreatePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    orgNumber: '',
    amountOfEmployees: 0
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: id === 'amountOfEmployees' ? parseInt(value) || 0 : value
    }))
  }

  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await axiosConfig.post('/Company/create', formData)
      console.log('Form submitted successfully:', response.data)
      Navigate('/company-select')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('An error occurred while submitting the form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300 backdrop-blur-md p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sätt upp Företag</CardTitle>
          <CardDescription>För in företags information</CardDescription>
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
                  value={formData[field.id]}
                  className="w-full"
                />
              </div>
            ))}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Skapar Företag...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}