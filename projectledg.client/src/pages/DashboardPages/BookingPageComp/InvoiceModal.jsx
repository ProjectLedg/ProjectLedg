import { useState, useEffect, useRef } from "react"
import { useReset } from "@/services/ResetProvider"
import ReactMarkdown from "react-markdown"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import Switch from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot } from "lucide-react"
import Typewriter from "@/Typewriter"
import { Spinner } from "@/components/ui/spinner"
import ChatLoader from "@/ChatLoader"
import SuccessAnimation from "./SuccessAnimation"

export default function InvoiceModal({ basAccounts, invoice, isModalOpen, setIsModalOpen, handleSaveChanges,
    handleSubmit, handleIsPaidStatusChange, isBooked }) {
    // const [input, setInput] = useState('');
    // const [loading, setLoading] = useState(false);
    const [isOn, setIsOn] = useState(false)
    const [triggerSound, setTriggerSound] = useState(false)
    const scrollAreaRef = useRef(null)


    // const [messages, setMessages] = useState(() => {
    //     const savedMessages = localStorage.getItem('chatMessages');
    //     return savedMessages ? JSON.parse(savedMessages) : [];
    // });
    // const [hasMessages, setHasMessages] = useState(messages.length > 0);

    // useEffect(() => {
    //     localStorage.setItem('chatMessages', JSON.stringify(messages));
    // }, [messages]);


    // Send message to the AI
    // const handleChatSubmit = async (e, inputText = input) => {
    //     if (e) e.preventDefault();
    //     if (inputText.trim()) {
    //         const newMessage = { text: inputText, type: 'sent' };
    //         setMessages((prevMessages) => [...prevMessages, newMessage]);
    //         setHasMessages(true);
    //         setInput('');

    //         setLoading(true);

    //         const response = await handleSend(inputText);

    //         const responseMessage = { text: response, type: 'received', isTyping: true };
    //         setMessages((prevMessages) => [...prevMessages, responseMessage]);
    //         setLoading(false);
    //     }
    // };

    // const handleSend = async (input) => {
    //     try {
    //         const response = await sendMessage(input);
    //         console.log('Response from server:', response);
    //         return response || 'No response received';
    //     } catch (error) {
    //         console.error("Error while sending message:", error);
    //         return 'Error occurred while sending message';
    //     }
    // };

    // const sendMessage = async (input) => {
    //     try {
    //         const response = await axios.post(
    //             'https://projectledg.azurewebsites.net/api/Assistant/chat',
    //             JSON.stringify(input),
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    //         return response.data; // Return the response data
    //     } catch (error) {
    //         console.error("Failed to send message", error);
    //         throw error; // Rethrow the error if you want to handle it further up
    //     }
    // }

    // // Render messages sent between the AI and the user
    // const renderedMessages = messages.map((message, index) => (
    //     <div
    //         key={index}
    //         className={`mb-12 flex items-start ${message.type === 'sent' ? 'self-end' : 'self-start'}`}
    //     >
    //         {message.type === 'received' && (
    //             <div className='p-2 mr-1 border-2 rounded-full  '>
    //                 <Bot className="w-4 h-4 " />
    //             </div>
    //         )}
    //         <div
    //             className={`${message.type === 'sent'
    //                 ? 'bg-green-500 text-sm  px-4 py-2 rounded-3xl shadow-xl ml-auto max-w-64 text-white break-words whitespace-normal'
    //                 : 'prose bg-gray-100 text-sm  px-4 py-2 rounded-3xl  max-w-[100%] text-black'
    //                 }`}
    //         >
    //             {message.type === 'sent' || !message.isTyping ? (
    //                 <ReactMarkdown>{message.text}</ReactMarkdown>
    //             ) : (
    //                 <Typewriter text={message.text} delay={5} onComplete={() => {
    //                     setMessages((prevMessages) =>
    //                         prevMessages.map((msg, i) =>
    //                             i === index ? { ...msg, isTyping: false } : msg
    //                         )
    //                     );
    //                 }} />

    //             )}
    //         </div>
    //     </div>
    // ));

    // const handleCloseModal = () => {
    //     setIsModalOpen(false)
    // }
    
    const { reset } = useReset();

    useEffect(() => {
        if (reset) {
            setIsOn(false)
            setTriggerSound(false)
        }

    }, [reset]);

    const handleConfirmPress = () => {
        if(handleSaveChanges) {
            handleSaveChanges()
        }
        setTriggerSound(true);
    }

    const resetModalFields = () => {
        setIsOn(false)
        setTriggerSound(false)

        // resetInvoiceFields()
    }


    // Temp to populate modal popup table
    // const rows = Array(12).fill(null)

    // Displayed while AI is mapping bas invoice to bas accs
    if (basAccounts.length === 0) {
        return (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="focus:outline-none ">
                <DialogContent className="h-auto flex flex-col min-w-[600px] min-h-[80vh]">
                    <DialogHeader >
                        <DialogTitle className="text-2xl font-bold text-green-600 ">Verifikation</DialogTitle>
                    </DialogHeader>

                    <div className="LoaderContainer flex flex-col items-center justify-center h-[65vh]">

                        <Spinner className="text-green-500" size="xlarge" />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }



    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} className="focus:outline-none ">
            <DialogContent className={` w-auto flex flex-col  min-w-[600px]  min-h-[80vh]`}>
                <DialogHeader className={`${isBooked ? "hidden" : "block"}`} >
                    <DialogTitle className="text-2xl font-bold text-green-600 ">Verifikation</DialogTitle>
                </DialogHeader>

                <div className={`${isBooked ? " hidden" : "flex"} VerificationContainer flex flex-col justify-between h-[80vh] overflow-hidden `}>
                    <div className="TopRow p-2 h-full flex flex-col border-gray-100">

                        {/* Chat section */}
                        {/* <div className="ChatSection  bg-gray-500/15 border-1 border-gray-300 shadow-inner shadow-gray-500/60 rounded-md h-auto">
                            <div className=" flex flex-col pt-4 px-2 overflow-y-auto flex-grow h-[30vh]">
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
                                                    e.preventDefault(); 
                                                    handleChatSubmit(); 
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
                        </div> */}


                        {/* Invoice info section */}
                        <div className="FakturaInfo space-y-2 mb-3">
                            {/* <h3 className="font-semibold text-lg mb-4">{invoice.VendorAddressRecipient} </h3> */}
                            <div className="Fakturanummer grid grid-cols-4 ">

                                <div className="flex flex-col col-span-3 justify-between space-y-2">
                                    <p className="font-bold text-lg text-gray-600 mb-1">{invoice.VendorAddressRecipient}</p>
                                    <p className="text-gray-600 ">Belopp</p>
                                    <p className="text-gray-500 font-light">Var av moms</p>
                                    <p className="text-gray-600">Fakturadatum</p>
                                    <p className="text-gray-600">Förfallodatum</p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <p className="font-bold text-lg text-gray-600 mb-1">{invoice.InvoiceId}</p>
                                    <p className="font-semibold text-green-600">{invoice.InvoiceTotal}kr</p>
                                    <p className="font-light text-gray-500">{invoice.TotalTax}kr</p>
                                    <p className="text-gray-600 ">{invoice.InvoiceDate}</p>
                                    <p className="text-gray-600 ">{invoice.DueDate}</p>
                                </div>
                            </div>

                            {/* Is paid button */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor="paid-status" className="font-normal text-base text-gray-600">Betald</Label>

                                <Switch isOn={isOn} setIsOn={setIsOn}
                                    id="paid-status"
                                    checked={invoice.isPaid}
                                    onCheckedChange={handleIsPaidStatusChange} />
                            </div>

                            {/* <div className="flex items-center justify-between">
                                <Label htmlFor="booked-status" className="text-gray-600">Bokförd:</Label>
                                <Badge variant={invoice.isBooked ? "success" : "destructive"}>
                                    {invoice.isBooked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                    <span className="ml-1">{invoice.isBooked ? "Bokförd" : "Ej bokförd"}</span>
                                </Badge>
                            </div> */}
                        </div>
                        
                        {/* Booking suggestion - bottom row */}
                        <div className="BottomRow flex flex-col border-t pt-3">
                            <div className="p-0 h-full flex flex-col justify-between space-y-10 ">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Bokföringsförslag</h3>
                                    <ScrollArea ref={scrollAreaRef} className="max-h-[40vh] w-full overflow-y-auto  ">
                                        <Table className="Scroll table overflow-y-auto overflow-x-hidden w-full border">
                                            <TableHeader className="bg-gray-100 dark:bg-black">
                                                <TableRow >
                                                    <TableHead className="text-center">Konto</TableHead>
                                                    <TableHead className="text-left">Beskrivning</TableHead>
                                                    <TableHead className="text-center">Debet</TableHead>
                                                    <TableHead className="text-center">Kredit</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="">
                                                {basAccounts.accounts.map((account, index) => (
                                                    <TableRow key={index} className="text-center">
                                                        <TableCell className="font-medium p-4">{account.BasAccount}</TableCell>
                                                        <TableCell className="text-left p-4">{account.Description}</TableCell>
                                                        <TableCell className="p-4">{account.Debit}</TableCell>
                                                        <TableCell className="p-4">{account.Credit}</TableCell>
                                                    </TableRow>
                                                ))}

                                                {/* Test data to populate the table with more data  */}
                                                {/* {rows.map((_, index) => (

                                                <TableRow className="text-center">
                                                    <TableCell className="font-medium p-2">1000</TableCell>
                                                    <TableCell className="text-left p-2">Pågående nyanläggningar och förskott
                                                        för byggnader och mark
                                                    </TableCell>
                                                    <TableCell className="p-2"> 128 </TableCell>
                                                    <TableCell className="p-2"> 123 </TableCell>
                                                </TableRow>
                                            ))} */}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </div>

                            </div>
                        </div>
                    </div>

                    <DialogFooter className="w-full ">
                        <Button onClick={handleConfirmPress} className="w-full bg-green-500  hover:bg-green-600 text-white">
                            Bekräfta och bokför
                        </Button>
                    </DialogFooter>
                </div>

                {/* Success animation for when invoice is booked  */}
                <div className={`${!isBooked ? "hidden" : "block"} `}>
                    {isBooked && <SuccessAnimation key={triggerSound} setIsModalOpen={setIsModalOpen} triggerSound={triggerSound}/>}
                </div>
            </DialogContent>
        </Dialog>
    )
}