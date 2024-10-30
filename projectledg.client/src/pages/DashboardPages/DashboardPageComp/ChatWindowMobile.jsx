import React, { useState } from 'react';
import { X, Send, FilePlus, Undo2, FileChartColumn, SquarePen, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';


export default function ChatWindow({ onClose, onSendMessage }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]); // State to hold the array of messages
    const [hasMessages, setHasMessages] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage = { text: input, type: 'sent' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setHasMessages(true); // Set hasMessages to true when a message is sent
            const response = await handleSend(input);

            const responseMessage = { text: response, type: 'received' };
            setMessages((prevMessages) => [...prevMessages, responseMessage]);

            setInput('');
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

    return (
        <div className="chatWindow flex flex-col right-0 p-2 w-full h-[100vh] bg-white/60 bg-opacity-80 shadow-lg rounded-l-2xl">
            <div className="bg-gray-100 rounded-xl overflow-hidden h-[100%] relative flex flex-col">
                <div className="flex justify-between items-center p-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <SquarePen size={25} />
                    </button>
                    <button onClick={onClose} className="text-gray-500 bg-gray-200 p-1 rounded-full hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                {!hasMessages ? (
                    <div className="p-6 space-y-4 flex flex-col justify-around h-[80%]">
                        <div className="space-y-2 flex flex-col items-center text-center">
                            <h2 className="text-3xl font-normal text-gray-400">
                                Hej <span className="text-green-500">Placeholder</span>
                            </h2>
                            <h3 className="text-xl font-semibold text-gray-800">Kan jag hjälpa dig med något?</h3>
                            <p className="text-md text-gray-600">
                                Oavsett om det gäller att hålla koll på utgifter, skapa fakturor eller något annat inom bokföring, finns jag här för dig!
                            </p>
                        </div>

                        <div className="space-y-2 flex flex-col justify-between h-[45%]">
                            {['Hur skapar jag en faktura?', 'Vilka utgifter är avdragsgilla?', 'Visa min senaste månatliga rapport'].map((topic, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left p-3 h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center space-x-2"
                                >
                                    <div className="w-8 h-8 text-gray-100 bg-gray-800 rounded-xl flex items-center justify-center">
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
                        <div className="flex flex-col p-4 overflow-y-auto flex-grow mb-12 whitespace-pre-line break-words">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 ${message.type === 'sent' ? 'bg-green-500 px-5 py-2 rounded-3xl shadow-md max-w-[70%] text-white self-end' : 'bg-transparent text-black self-start'}`}
                                >
                                    <ReactMarkdown
                                        children={message.text}
                                        remarkPlugins={[remarkBreaks]} // Handles line breaks
                                    />
                                </div>
                            ))}
                        </div>
                )}

                <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 bg-transparent p-1">
                    <div className="flex flex-row justify-between items-center space-x-2">
                        <div className="flex-grow p-2 h-auto bg-white rounded-3xl flex items-center">
                            <button
                                type="button"
                                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-500 transition-colors duration-200"
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
                                placeholder="Fråga Ledge..."
                                className="flex-grow p-2 bg-transparent rounded-none focus:outline-none resize-none overflow-hidden"
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
    );
}
