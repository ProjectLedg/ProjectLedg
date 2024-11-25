import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get('https://projectledgserver.azurewebsites.net/api/SupportTickets');
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const updateTicketStatus = async (ticketId, status) => {
        try {
            await axios.patch(`https://projectledgserver.azurewebsites.net/api/SupportTickets/${ticketId}/status`, { status });
            setMessage(`Ticket status updated to ${status}`);
            fetchTickets();
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    return (
        <div className="admin-tickets">
            <h2>Support Tickets</h2>
            {message && <p>{message}</p>}
            <div className="tickets-list">
                {['Open', 'In Progress', 'Closed'].map((status) => (
                    <div key={status} className="tickets-section">
                        <h3>{status}</h3>
                        {tickets.filter(ticket => ticket.status === status).map(ticket => (
                            <div key={ticket.ticketId} className="ticket-item">
                                <p><strong>Ämne:</strong> {ticket.subject}</p>
                                <p><strong>Kategori:</strong> {ticket.category}</p>
                                <p><strong>Beskrivning:</strong> {ticket.description}</p>
                                <p><strong>Prioritet:</strong> {ticket.priority}</p>
                                <p><strong>Status:</strong> {ticket.status}</p>
                                <div className="status-actions">
                                    {status !== 'Closed' && (
                                        <button onClick={() => updateTicketStatus(ticket.ticketId, 'In Progress')}>
                                            Sätt som Pågående
                                        </button>
                                    )}
                                    {status !== 'Closed' && (
                                        <button onClick={() => updateTicketStatus(ticket.ticketId, 'Closed')}>
                                            Stäng Ärende
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTickets;
