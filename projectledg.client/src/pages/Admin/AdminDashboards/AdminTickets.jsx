import React, { useState } from 'react';
import axios from 'axios';

const UserTickets = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('https://localhost:7223/api/SupportTickets', {
                subject,
                description,
                priority
            });
            setMessage('Support ticket submitted successfully!');
            setSubject('');
            setDescription('');
            setPriority('Low');
        } catch (error) {
            setMessage('Failed to submit ticket. Please try again.');
            console.error('Error submitting support ticket:', error);
        }
    };

    return (
        <div className="ticket-form">
            <h2>Create a Support Ticket</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Subject:
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Priority:
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
                <button type="submit">Submit Ticket</button>
            </form>
        </div>
    );
};

export default UserTickets;