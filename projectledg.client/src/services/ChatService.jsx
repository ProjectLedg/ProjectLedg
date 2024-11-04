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
            throw error; // Rethrow the error if you want to handle it further up
        }
    }
    

    return mobile ? (
        <ChatWindowMobile onClose={onClose} onSendMessage={sendMessage} />
    ) : (
        <ChatWindow onClose={onClose} onSendMessage={sendMessage} />
    );
}
