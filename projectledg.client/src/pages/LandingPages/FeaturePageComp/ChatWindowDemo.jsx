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

export default function ChatWindow() {
    // Mock messages for demo
    const messages = [
        { text: "Hej Anders! Hur kan jag hjälpa dig idag?", type: "received" },
        { text: "Hur mycket har jag spenderat på kontorsmaterial den här månaden?", type: "sent" },
      
    ];

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
                    : 'prose px-3 py-3 rounded-3xl max-w-[100%] text-black dark:text-white'
                    }`}
            >
                <ReactMarkdown>{message.text}</ReactMarkdown>
                
            </div>
            
        </div>
        
    ));

    return (
        <div className="chatWindow flex flex-col  p-2 w-[30vw] h-[80vh] bg-white/60 dark:bg-darkBackground bg-opacity-80 rounded-l-2xl ">
            <div className="bg-gray-100 dark:bg-darkSurface rounded-xl overflow-hidden h-[100%]">
                <div className="flex justify-between items-center p-4 shadow-sm">
                    <button className="text-gray-500 dark:text-white">
                        <SquarePen size={25} />
                    </button>
                    <button className="text-gray-500 dark:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col p-4 overflow-hidden flex-grow mb-12 h-[90%]">
                    {renderedMessages}
                </div>

                <form className="absolute bottom-0 left-0 right-0 bg-transparent p-4">
                    <div className="flex flex-row justify-between items-center space-x-2">
                        <div className="flex-grow p-2 h-auto bg-white rounded-3xl flex items-center">
                            <button
                                type="button"
                                className="p-2 bg-gray-800 text-white rounded-full"
                                disabled
                            >
                                <Paperclip size={20} />
                            </button>
                            <textarea
                                placeholder="Fråga Ledge..."
                                className="flex-grow p-2 bg-transparent rounded-none focus:outline-none resize-none overflow-hidden dark:text-black"
                                rows="1"
                                disabled
                            />
                            <button
                                type="button"
                                className="p-2 bg-green-500 text-white rounded-full"
                                disabled
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
