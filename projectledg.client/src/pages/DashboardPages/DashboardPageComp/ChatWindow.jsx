import React, { useState } from 'react'
import { X, Send, FilePlus, Undo2, FileChartColumn, SquarePen, Paperclip} from 'lucide-react'

export default function ChatWindow({ onClose }) {
    const [input, setInput] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle message submission here
        setInput('')
    }

    return (
        <div className="chatWindow flex flex-col absolute bottom--1 right-0 p-2 w-[40vw] h-[80vh] bg-white/60 bg-opacity-80 shadow-lg rounded-l-2xl max-w-[620px] ml-4">
            <div className="bg-gray-100 rounded-xl overflow-hidden h-[100%]">
                <div className="flex justify-between items-center p-4">
                    <button onClick={onClose} className="text-gray-500  hover:text-gray-700">
                        <SquarePen size={25} />
                    </button>
                    <button onClick={onClose} className="text-gray-500 bg-gray-200 p-1 rounded-full hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 flex flex-col justify-around h-[80%] mb-8">
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

                <form onSubmit={handleSubmit} className="p-4 bg-transparent">
                    <div className="flex flex-row justify-between items-center space-x-2">
                        <div className="flex-grow p-2 h-14 bg-white rounded-full  flex items-center">
                            <button type="submit" className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-500 transition-colors duration-200">
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Fråga Ledge..."
                                className="flex-grow p-2 bg-transparent rounded-full focus:outline-none "
                            />
                            <button type="submit" className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </form>


            </div>

    
        </div>
    )
}
