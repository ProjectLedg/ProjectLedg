import React, { useState } from 'react';
import axios from 'axios';

const TicketPage = () => {
    const [category, setCategory] = useState('Technical');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const determinePriority = (category) => {
        switch (category) {
            case 'Technical':
            case 'ProductSupport':
                return 'High';
            case 'Billing':
            case 'AccountManagement':
                return 'Medium';
            case 'GeneralInquiry':
            case 'Feedback':
                return 'Low';
            default:
                return 'Low';
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        const priority = determinePriority(category);

        const formData = new FormData();
        formData.append('category', category);
        formData.append('subject', subject);
        formData.append('description', description);
        formData.append('priority', priority);
        if (image) formData.append('image', image);

        try {
            await axios.post('https://localhost:7223/api/SupportTickets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Support ticket submitted successfully!');
            setCategory('Technical');
            setSubject('');
            setDescription('');
            setImage(null);
            setPreviewUrl('');
        } catch (error) {
            setMessage('Failed to submit ticket. Please try again.');
            console.error('Error submitting support ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Skapa ett Supportärende</h2>
            {message && (
                <p className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="Technical">Teknisk</option>
                        <option value="Billing">Fakturering</option>
                        <option value="AccountManagement">Konto Hantering</option>
                        <option value="GeneralInquiry">Allmän Fråga</option>
                        <option value="ProductSupport">Produktstöd</option>
                        <option value="Feedback">Feedback</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ämne:</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Skriv ämnet för ärendet"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivning:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Beskriv ditt problem eller fråga"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bifoga Bild (valfritt):</label>
                    <div className="flex items-center space-x-4">
                        <label className="px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition">
                            Välj Bild
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-md shadow-md" />
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Skickar...' : 'Skicka Ärende'}
                </button>
            </form>
        </div>
    );
};

export default TicketPage;
