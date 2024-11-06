import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"
import { axiosConfig } from '/axiosconfig'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Switch from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X, FileText, Send, Paperclip, Bot } from "lucide-react"
import Typewriter from "@/Typewriter"
import ChatLoader from "@/ChatLoader"

export default function InvoiceModal({ basAccounts, invoice, isModalOpen, setIsModalOpen, handleSaveChanges, handleSubmit })  {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOn, setIsOn] = useState(false)

    const scrollAreaRef = useRef(null)
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [hasMessages, setHasMessages] = useState(messages.length > 0);

    // Temp to populate modal popup table
    const rows = Array(12).fill(null)

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);


    // Send message to the AI
    const handleChatSubmit = async (e, inputText = input) => {
        if (e) e.preventDefault();
        if (inputText.trim()) {
            const newMessage = { text: inputText, type: 'sent' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setHasMessages(true);
            setInput('');

            setLoading(true);

            const response = await handleSend(inputText);

            const responseMessage = { text: response, type: 'received', isTyping: true };
            setMessages((prevMessages) => [...prevMessages, responseMessage]);
            setLoading(false);
        }
    };

    const handleSend = async (input) => {
        try {
            const response = await sendMessage(input);
            console.log('Response from server:', response);
            return response || 'No response received';
        } catch (error) {
            console.error("Error while sending message:", error);
            return 'Error occurred while sending message';
        }
    };

    const sendMessage = async (input) => {
        try {
            const response = await axios.post(
                'https://projectledg.azurewebsites.net/api/Assistant/chat',
                JSON.stringify(input),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data; // Return the response data
        } catch (error) {
            console.error("Failed to send message", error);
            throw error; // Rethrow the error if you want to handle it further up
        }
    }

    // Render messages sent between the AI and the user
    const renderedMessages = messages.map((message, index) => (
        <div
            key={index}
            className={`mb-12 flex items-start ${message.type === 'sent' ? 'self-end' : 'self-start'}`}
        >
            {message.type === 'received' && (
                <div className='p-2 mr-1 border-2 rounded-full  '>
                    <Bot className="w-4 h-4 " />
                </div>
            )}
            <div
                className={`${message.type === 'sent'
                    ? 'bg-green-500 text-sm  px-4 py-2 rounded-3xl shadow-xl ml-auto max-w-64 text-white break-words whitespace-normal'
                    : 'prose bg-gray-100 text-sm  px-4 py-2 rounded-3xl  max-w-[100%] text-black'
                    }`}
            >
                {message.type === 'sent' || !message.isTyping ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                    <Typewriter text={message.text} delay={5} onComplete={() => {
                        setMessages((prevMessages) =>
                            prevMessages.map((msg, i) =>
                                i === index ? { ...msg, isTyping: false } : msg
                            )
                        );
                    }} />

                )}
            </div>
        </div>
    ));


    // Displayed while AI is mapping bas invoice to bas accs
    if(!basAccounts){
        return (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="focus:outline-none">
                <DialogContent className="max-w-[70vw] h-[80vh] flex flex-col ">
                    <DialogHeader >
                        <DialogTitle className="text-2xl font-bold text-green-600 ">Verifikation</DialogTitle>
                    </DialogHeader>

                    <div className="GridContainer grid grid-cols-2 gap-8     h-[70vh]   ">
                        
                        <h4>LOADING TEST</h4>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="focus:outline-none">
            <DialogContent className="max-w-[80vw] h-[95vh] flex flex-col ">
                <DialogHeader >
                    <DialogTitle className="text-2xl font-bold text-green-600 ">Verifikation</DialogTitle>
                </DialogHeader>

                <div className="GridContainer grid grid-cols-2 h-full">
                    {/* <ScrollArea className="h-[90%] px-4" ref={scrollAreaRef}> */}
                    <div className="LeftColumn p-2 mb-4 h-full flex flex-col justify-between border-r-4 border-gray-100 pr-4 ">

                        <div className="FakturaInfo space-y-2">
                            {/* <h3 className="font-semibold text-lg mb-4">{invoice.VendorAddressRecipient} </h3> */}
                            <div className="Fakturanummer grid grid-cols-4 ">

                                <div className="flex flex-col col-span-3 justify-between space-y-2">
                                    <p className="font-bold text-lg text-gray-600 mb-1">{invoice.VendorAddressRecipient}</p>
                                    <p className=" text-gray-600 ">Belopp</p>
                                    <p className="font-light text-gray-500">Var av moms</p>
                                    <p className=" text-gray-600">Fakturadatum</p>
                                    <p className=" text-gray-600">Förfallodatum</p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <p className="font-bold text-lg text-gray-600 mb-1">{invoice.InvoiceId}</p>
                                    <p className="font-semibold text-green-600">{invoice.InvoiceTotal}kr</p>
                                    <p className="font-light text-gray-500">{invoice.TotalTax}kr</p>
                                    <p className="text-gray-600 ">{invoice.InvoiceDate}</p>
                                    <p className="text-gray-600 ">{invoice.DueDate}</p>
                                </div>
                            </div>
                          
                            <div className="flex items-center justify-between">
                                <Label htmlFor="paid-status" className="font-normal text-base text-gray-600">Betald</Label>

                                <Switch isOn={isOn} setIsOn={setIsOn}
                                    id="paid-status"
                                    checked={invoice.isPaid}
                                    onCheckedChange={() => handleStatusChange('isPaid')} />
                            </div>

                            {/* <div className="flex items-center justify-between">
                                <Label htmlFor="booked-status" className="text-gray-600">Bokförd:</Label>
                                <Badge variant={invoice.isBooked ? "success" : "destructive"}>
                                    {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                    <span className="ml-1">{invoice.isBooked ? "Bokförd" : "Ej bokförd"}</span>
                                </Badge>
                            </div> */}
                        </div>

                        <div className="ChatSection  bg-gray-500/15 border-1 border-gray-300 shadow-inner shadow-gray-500/60 rounded-md h-auto">
                            <div className=" flex flex-col pt-4 px-2 overflow-y-auto flex-grow    min-h-[20vh]">
                                {/* Put placeholder if messages are null */}
                                {renderedMessages}
                                {loading && <ChatLoader className="mb-12" />}
                            </div>
                            <form onSubmit={handleSubmit} className="bg-transparent ">
                                <div className="flex flex-row w-[100%] 0 justify-between items-center space-x-2 border-gray-300 border-2 rounded-b-md ">
                                    <div className="flex-grow px-1 py-2 h-auto flex items-center bg-gray-100/80 rounded-b-md">
                                        <textarea
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                e.target.style.height = "auto";
                                                e.target.style.height = `${e.target.scrollHeight}px`;
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault(); // Prevent default behavior (new line)
                                                    handleChatSubmit(); // Call the submit handler
                                                }
                                            }}
                                            placeholder="Fråga Ledge..."
                                            className="flex-grow text-sm p-1 h-auto bg-transparent focus:outline-none resize-none overflow-hidden "
                                            rows="1"
                                        />
                                        <button
                                            type="submit"
                                            className="p-[0.75rem] bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                        {/* Booking suggestion - right column */}
                    <div className="RightColumn p-2 flex flex-col pl-4">
                        <div className="p-0 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Bokföringsförslag</h3>
                                <ScrollArea ref={scrollAreaRef} className="max-h-[95%] w-full overflow-y-auto border-t-2 border-b-2">
                                    <Table className="Scroll table overflow-y-auto overflow-x-hidden w-full">
                                        <TableHeader className="border-2 bg-gray-100">
                                            <TableRow>
                                                <TableHead className="w-8 border-2">Konto</TableHead>
                                                <TableHead className="w-18 border-2">Beskrivning</TableHead>
                                                <TableHead className="border-2">Debet</TableHead>
                                                <TableHead className="border-2">Kredit</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {basAccounts.map((account, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="border-2 w-8">{account.BasAccount}</TableCell>
                                                    <TableCell className="w-18 border-2">{account.Description}</TableCell>
                                                    <TableCell className="text-center border-2">{account.Debit}</TableCell>
                                                    <TableCell className="text-center border-2">{account.Credit}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                            <DialogFooter className="w-full ">
                                <Button onClick={handleSaveChanges} className="w-full bg-green-500  hover:bg-green-600 text-white">
                                    Bekräfta och bokför
                                </Button>
                            </DialogFooter>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}