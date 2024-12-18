import ChatWindow from "@/pages/DashboardPages/DashboardPageComp/ChatWindow";
import ChatWindowMobile from "@/pages/DashboardPages/DashboardPageComp/ChatWindowMobile";
import { axiosConfig } from '/axiosconfig'

export default function ChatService({ onClose, mobile, userName }) {
    async function sendMessage(input) {
        try {
            const response = await axiosConfig.post(
                'https://projectledgserver.azurewebsites.net/api/Assistant/chat',
                JSON.stringify(input)
            );
            return response.data; // Return the response data
        } catch (error) {
            console.error("Failed to send message", error);
            const response = ("Något gick tyvärr fel när jag försökte skicka meddelandet. Försök gärna igen om en stund!")
            return response;
        }
    }

 

    return mobile ? (
        <ChatWindowMobile onClose={onClose} onSendMessage={sendMessage} userName={userName} />
    ) : (
        <ChatWindow onClose={onClose} onSendMessage={sendMessage} userName={userName} />
    );
}
