import AdminChatWindow from "@/pages/Admin/AdminComps/ChatWindow";
import AdminChatWindowMobile from "@/pages/Admin/AdminComps/ChatWindowMobile";
import axios from 'axios';

export default function AdminChatService({ onClose, mobile }) {
    async function sendMessage(input) {
        try {
            const commandParts = input.split(' '); // Split the command into parts
            const command = commandParts[0].toLowerCase(); // Extract the command (first word)

            switch (command) {
                case 'hjälp':
                    return `
**Tillgängliga Kommandon**:
- **Hjälp**: Visa denna lista av tillgängliga kommandon.
- **Ticket**: Hämta ett slumpmässigt ärende att hantera.
- **Respond [ticketId] [message]**: Skicka ett svar till en kund på ett specifikt ärende.
- **Close [ticketId]**: Stäng ett specifikt ärende.
- **OpenTickets**: Visa antal öppnade ärenden.
- **!Ticket**: Visa antal ärenden sorterade efter prioritet.
                    `;

                    case 'ticket': {
                        const response = await axios.get('https://projectledgserver.azurewebsites.net/api/SupportTickets/random');
                        if (!response.data) return 'Inga ärenden tillgängliga.';
                        const { ticketId, subject, description, imageUrl } = response.data;
                    
                        return `**Ticket ID:** ${ticketId}\n\n**Ämne:** ${subject}\n\n**Beskrivning:** ${description}\n\n${
                            imageUrl ? `**Bild/Media:**\n\n[Visa Bifogad Bild](${imageUrl})` : 'Ingen bifogad bild'
                        }`;
                    }
                    

                    case 'respond': {
                        if (commandParts.length < 3) {
                            return 'Fel format. Använd: respond [ticketId] [message]';
                        }
                    
                        const ticketId = commandParts[1];
                        const message = commandParts.slice(2).join(' '); // Combine the rest of the command as the message
                    
                        try {
                            const response = await axios.post(
                                `https://projectledgserver.azurewebsites.net/api/SupportTickets/${ticketId}/respond`,
                                message, // Send the message directly as the body
                                {
                                    headers: {
                                        'Content-Type': 'application/json', // Ensure JSON content type
                                    },
                                }
                            );
                    
                            if (response.status === 200) {
                                return `Svar skickat till Ticket ID: ${ticketId}`;
                            } else {
                                return `Misslyckades att skicka svaret. Statuskod: ${response.status}`;
                            }
                        } catch (error) {
                            console.error("Failed to respond to ticket:", error);
                    
                            if (error.response) {
                                console.error("Response data:", error.response.data);
                                console.error("Status:", error.response.status);
                                console.error("Headers:", error.response.headers);
                    
                                return `Kunde inte skicka svar till Ticket ID: ${ticketId}. Fel: ${JSON.stringify(error.response.data)}`;
                            } else if (error.request) {
                                console.error("Request data:", error.request);
                                return `Kunde inte skicka svar till Ticket ID: ${ticketId}. Inga svar från servern.`;
                            } else {
                                console.error("Error message:", error.message);
                                return `Kunde inte skicka svar till Ticket ID: ${ticketId}. Fel: ${error.message}`;
                            }
                        }
                    }
                    

                case 'close': {
                    if (commandParts.length < 2) {
                        return 'Fel format. Använd: close [ticketId]';
                    }
                    const ticketId = commandParts[1];
                    const response = await axios.post(
                        `https://projectledgserver.azurewebsites.net/api/SupportTickets/${ticketId}/close`
                    );
                    if (response.status === 200) {
                        return `Ärende med Ticket ID: ${ticketId} har stängts.`;
                    } else {
                        return 'Misslyckades att stänga ärendet.';
                    }
                }

                case 'opentickets': {
                    const response = await axios.get('https://projectledgserver.azurewebsites.net/api/SupportTickets/statistics/open');
                    const count = response.data;
                    return `Det finns **${count}** öppna ärenden.`;
                }

                case '!ticket': {
                    const response = await axios.get('https://projectledgserver.azurewebsites.net/api/SupportTickets/statistics/priority?status=Open');
                    const priorities = response.data;
                    return Object.entries(priorities)
                        .map(([priority, count]) => `**${priority}**: ${count}`)
                        .join('\n');
                }

                default:
                    return 'Beep-Boop-Beep, Jag känner inte till detta kommando. Skriv **Hjälp** för att se alla tillgängliga kommandon.';
            }
        } catch (error) {
            console.error("Failed to process command:", error);
            return "Ett fel uppstod vid bearbetning av ditt kommando.";
        }
    }

    return mobile ? (
        <AdminChatWindowMobile onClose={onClose} onSendMessage={sendMessage} />
    ) : (
        <AdminChatWindow onClose={onClose} onSendMessage={sendMessage} />
    );
}
