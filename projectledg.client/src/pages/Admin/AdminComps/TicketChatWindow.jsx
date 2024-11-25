import React, { useState, useEffect } from 'react';
import ChatLoader from '@/pages/Admin/AdminChat/AdminChatLoader';
import ReactMarkdown from 'react-markdown';
import { X, Send, FilePlus, Undo2, FileChartColumn, SquarePen, Bot } from 'lucide-react';

export default function TicketChatWindow({ onClose }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (input.trim()) {
            const newMessage = { text: input, type: 'sent' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput('');
            setLoading(true);

            const response = await processCommand(input);

            const responseMessage = { text: response, type: 'received' };
            setMessages((prevMessages) => [...prevMessages, responseMessage]);
            setLoading(false);
        }
    };

    const processCommand = async (command) => {
        console.log('Processing command:', command); // Debugging
        try {
            switch (command.toLowerCase()) {
                case 'help':
                    return `
**Available Commands**:
- **Help**: Show this list of commands.
- **Tickets**: List all support tickets.
- **Open Tickets**: Show count of open tickets.
- **Tickets By Priority**: Show ticket counts by priority.
                    `;
                case 'tickets':
                    return await fetchTickets();
                case 'open tickets':
                    return await fetchOpenTicketsCount();
                case 'tickets by priority':
                    return await fetchTicketsByPriority('Open');
                default:
                    return 'Unknown command. Type **Help** to see available commands.';
            }
        } catch (error) {
            console.error('Error processing command:', error);
            return 'An error occurred while processing your request.';
        }
    };

    const fetchTickets = async () => {
        try {
            console.log('Fetching tickets...');
            const response = await fetch('https://projectledgserver.azurewebsites.net/api/SupportTickets');
            if (!response.ok) throw new Error('Failed to fetch tickets');
            const tickets = await response.json();
            return tickets.length
                ? tickets.map(ticket => `**${ticket.subject}** - ${ticket.status}`).join('\n')
                : 'No tickets found.';
        } catch (error) {
            console.error('Error fetching tickets:', error);
            return 'Failed to retrieve tickets.';
        }
    };

    const fetchOpenTicketsCount = async () => {
        try {
            console.log('Fetching open tickets count...');
            const response = await fetch('https://projectledgserver.azurewebsites.net/api/SupportTickets/statistics/open');
            if (!response.ok) throw new Error('Failed to fetch open tickets count');
            const count = await response.json();
            return `There are ${count} open tickets.`;
        } catch (error) {
            console.error('Error fetching open tickets count:', error);
            return 'Failed to retrieve open tickets count.';
        }
    };

    const fetchTicketsByPriority = async (status) => {
        try {
            console.log('Fetching tickets by priority...');
            const response = await fetch(`https://projectledgserver.azurewebsites.net/api/SupportTickets/statistics/priority?status=${status}`);
            if (!response.ok) throw new Error('Failed to fetch tickets by priority');
            const priorities = await response.json();
            return Object.entries(priorities)
                .map(([priority, count]) => `**${priority}**: ${count}`)
                .join('\n');
        } catch (error) {
            console.error('Error fetching tickets by priority:', error);
            return 'Failed to retrieve tickets by priority.';
        }
    };

    const renderedMessages = messages.map((message, index) => (
        <div
            key={index}
            className={`mb-12 flex items-start ${message.type === 'sent' ? 'self-end' : 'self-start'}`}
        >
            {message.type === 'received' && (
                <div className="p-2 mt-1 border-2 rounded-full">
                    <Bot className="w-6 h-6" />
                </div>
            )}
            <div
                className={`${message.type === 'sent'
                    ? 'bg-green-500 px-5 py-3 rounded-3xl shadow-lg ml-auto max-w-64 text-white break-words whitespace-normal'
                    : 'prose bg-gray-100 px-3 py-3 rounded-3xl max-w-[100%] text-black'
                    }`}
            >
                <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
        </div>
    ));

    return (
        <div className="chatWindow flex flex-col right-0 p-2 w-[30vw] h-[80vh] bg-white/60 bg-opacity-80 shadow-lg rounded-l-2xl max-w-[720px]">
            <div className="bg-gray-100 rounded-xl overflow-hidden h-[100%]">
                <div className="flex justify-between items-center p-4 shadow-sm">
                    <button onClick={onClose} className="text-gray-500 bg-gray-200 p-1 rounded-full hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                {!messages.length ? (
                    <div className="p-6 space-y-4 flex flex-col justify-around h-[80%]">
                        <div className="space-y-2 flex flex-col items-center text-center">
                            <h2 className="text-3xl font-normal text-gray-400">
                                Hello, <span className="text-green-500">User</span>
                            </h2>
                            <h3 className="text-xl font-semibold text-gray-800">Manage Support Tickets Here</h3>
                            <p className="text-md text-gray-600">
                                Whether it's viewing tickets or analyzing priorities, I'm here to help!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col p-4 overflow-y-auto flex-grow mb-12 h-[90%]">
                        {renderedMessages}
                        {loading && <ChatLoader className="mb-12" />}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 bg-transparent p-1">
                    <div className="flex flex-row justify-between items-center space-x-2">
                        <div className="flex-grow p-2 h-auto bg-white rounded-3xl flex items-center">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a command..."
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
