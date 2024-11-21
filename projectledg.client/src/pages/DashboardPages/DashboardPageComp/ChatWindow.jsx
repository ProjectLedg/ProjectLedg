import React, { useState, useEffect } from 'react'
import ChatLoader from '@/ChatLoader';
import Typewriter from '@/Typewriter';
import ReactMarkdown from 'react-markdown';
import { X, Send, FilePlus, Undo2, FileChartColumn, SquarePen, Paperclip, Bot } from 'lucide-react'

import {
    TooltipShad,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ChatWindow({ onClose, onSendMessage }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [hasMessages, setHasMessages] = useState(messages.length > 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const handleSubmit = async (e, inputText = input) => {
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
            const response = await onSendMessage(input);
            console.log('Response from server:', response);
            return response || 'No response received';
        } catch (error) {
            console.error("Error while sending message:", error);
            return 'Error occurred while sending message';
        }
    };

    const handleSuggestionClick = async (suggestion) => {
        setInput(suggestion);
        await handleSubmit(null, suggestion);
    };

    const handleNewChat = () => {
        console.log("Resetting chat");
        setMessages([]);
        setHasMessages(false);
        localStorage.removeItem('chatMessages');
    };

    const renderedMessages = messages.map((message, index) => (
        <div
            key={index}
            className={`mb-12 flex items-start ${message.type === 'sent' ? 'self-end' : 'self-start'}`}
        >
            {message.type === 'received' && (
                <div className='p-2 mt-1 border-2 dark:border-darkBorder rounded-full '>
                    <Bot className="w-6 h-6 " />
                </div>
            )}
            <div
                className={`${message.type === 'sent'
                    ? 'bg-green-500 dark:bg-neutral-700 px-5 py-3 rounded-3xl shadow-lg ml-auto max-w-64 text-white break-words whitespace-normal'
                    : 'prose  px-3 py-3 rounded-3xl  max-w-[100%] text-black dark:text-white'
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

    return (
        <div className="chatWindow flex flex-col  right-0 p-2 w-[30vw] h-[80vh] bg-white/60 dark:bg-darkBackground bg-opacity-80 shadow-lg rounded-l-2xl max-w-[720px]">
            <div className="bg-gray-100 dark:bg-darkSurface rounded-xl overflow-hidden h-[100%]">
                <div className="flex justify-between items-center p-4 shadow-sm">

                    <TooltipProvider>
                        <TooltipShad>
                            <TooltipTrigger>
                                <button onClick={handleNewChat} className="text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-darkSecondary">
                                    <SquarePen size={25} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Ny chatt</TooltipContent>
                        </TooltipShad>
                    </TooltipProvider>

                    <button onClick={onClose} className="text-gray-500 dark:text-white bg-gray-200 dark:bg-darkSurface p-1 rounded-full hover:text-gray-700 hover:dark:text-darkSecondary">
                        <X size={20} />
                    </button>
                </div>

                {!hasMessages ? (
                    <div className="p-6 space-y-4 flex flex-col justify-around h-[80%] dark:bg-darkSurface ">
                        <div className="space-y-2 flex flex-col items-center text-center">
                            <h2 className="text-3xl font-normal text-gray-400 dark:text-white">
                                Hej <span className="text-green-500">Placeholder</span>
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Kan jag hjälpa dig med något?</h3>
                            <p className="text-md text-gray-600 dark:text-darkSecondary">
                                Oavsett om det gäller att hålla koll på utgifter, skapa fakturor eller något annat inom bokföring, finns jag här för dig!
                            </p>
                        </div>

                        <div className="space-y-2 flex flex-col justify-between h-[45%] ">
                            {['Hur skapar jag en faktura?', 'Vilka utgifter är avdragsgilla?', 'Visa min senaste månatliga rapport'].map((topic, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left p-3 h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center space-x-2"
                                    onClick={() => handleSuggestionClick(topic)}
                                >
                                    <div className="w-8 h-8 text-gray-100 bg-gray-800 dark:bg-darkSurface rounded-xl flex items-center justify-center">
                                        {index === 0 ? (
                                            <FilePlus className="w-4 h-4" />
                                        ) : index === 1 ? (
                                            <Undo2 className="w-4 h-4" />
                                        ) : (
                                            <FileChartColumn className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{topic}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col p-4 overflow-y-auto flex-grow mb-12 h-[90%]">
                        {renderedMessages}
                        {loading && <ChatLoader className="mb-12" />}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 bg-transparent p-4">
                    <div className="flex flex-row justify-between items-center space-x-2">
                        <div className="flex-grow p-2 h-auto bg-white rounded-3xl flex items-center">
                            <button
                                type="button"
                                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-500 dark:bg-darkSurface hover:dark:bg-darkSecondary transition-colors duration-200"
                            >
                                <Paperclip size={20} />
                            </button>
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
                                        handleSubmit(); // Call the submit handler
                                    }
                                }}
                                placeholder="Fråga Ledge..."
                                className="flex-grow p-2 bg-transparent rounded-none focus:outline-none resize-none overflow-hidden dark:text-black"
                                rows="1"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </form>



            </div>


        </div>
    )
}
