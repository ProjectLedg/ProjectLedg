import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

export default function AccountingBotChat() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/chat-messages')
      if (Array.isArray(response.data)) {
        setMessages(response.data)
      } else {
        console.error('API did not return an array:', response.data)
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      setMessages([])
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    setIsLoading(true)
    const newMessage = { content: inputMessage, sender: 'user' }

    try {
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputMessage("")

      const response = await axios.post('/api/chat-messages', { message: inputMessage })
      const botReply = { content: response.data.reply, sender: 'bot' }
      setMessages(prevMessages => [...prevMessages, botReply])
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prevMessages => prevMessages.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">AI Accounting Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {Array.isArray(messages) && messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } mb-4`}
            >
              <div className={`flex items-end max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender === 'user' ? "/placeholder-user.jpg" : "/placeholder-bot.jpg"} />
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-green-100 text-gray-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow rounded-full"
          />
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="rounded-full bg-green-500 hover:bg-green-600 text-white" 
            size="icon"
          >
            {isLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}