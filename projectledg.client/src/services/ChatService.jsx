import ChatWindow from "@/pages/DashboardPages/DashboardPageComp/ChatWindow";
import ChatWindowMobile from "@/pages/DashboardPages/DashboardPageComp/ChatWindowMobile"
import axios from 'axios';

export default function ChatService({ onClose, mobile }) {
    async function sendMessage(input) {
        try {
            const response = await axios.post(
                'https://projectledg.azurewebsites.net/api/Assistant/chat',
                JSON.stringify(input), // Send the input directly as a string
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure the Content-Type header is set
                    },
                }
            );
            console.log(response);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    }

    return mobile ? (
        <ChatWindowMobile onClose={onClose} onSendMessage={sendMessage} />
    ) : (
        <ChatWindow onClose={onClose} onSendMessage={sendMessage} />
    );
}
