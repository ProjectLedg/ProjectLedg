import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import axios from 'axios'

export default function Component() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      // Simulating API call Behöver bytas ut mot riktig endpoint och sätta loader enligt det, samt felhantering
      const response = await axios.post('https://projectledgserver.azurewebsites.net/api/email/AddEmail', { email })

      setStatus('success')
      setMessage('Tack för din prenumeration!')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Ett fel uppstod. Försök igen senare.')
    }
  }

  return (
    <div className="w-full max-w-md ">
      <div className="p-12 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Prenumerera på vårt nyhetsbrev</h2>
        <p className="mb-6 text-center text-gray-600">Få de senaste nyheterna och uppdateringarna direkt i din inkorg.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-2">
            <Input
              type="email"
              placeholder="Din e-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow bg-white bg-opacity-50 border-gray-300 focus:border-black focus:ring-black transition-colors duration-300"
              disabled={status === 'loading'}
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full sm:w-auto    ${status === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
                } text-white transition-all duration-300 ease-in-out transform hover:bg-green-500`}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Skickar...
                </span>
              ) : (
                <span className="flex items-center justify-center ">
                  Prenumerera <Send className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
          {message && (
            <p className={`text-center text-sm font-medium ${status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}