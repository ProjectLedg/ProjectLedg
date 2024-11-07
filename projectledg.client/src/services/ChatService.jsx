import ChatWindow from "@/pages/DashboardPages/DashboardPageComp/ChatWindow";
import ChatWindowMobile from "@/pages/DashboardPages/DashboardPageComp/ChatWindowMobile";
import axios from 'axios';

export default function ChatService({ onClose, mobile }) {
    async function sendMessage(input) {
        try {
            const response = await axios.post(
                'https://projectledg.azurewebsites.net/api/Assistant/chat',
                JSON.stringify(input),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data; // Return the response data
        } catch (error) {
            console.error("Failed to send message", error);
            const response = ("Något gick tyvärr fel när jag försökte skicka meddelandet. Försök gärna igen om en stund!")
            return response;
        }
    }
    

    return mobile ? (
        <ChatWindowMobile onClose={onClose} onSendMessage={sendMessage} />
    ) : (
        <ChatWindow onClose={onClose} onSendMessage={sendMessage} />
    );
}
