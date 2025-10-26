import AppLayout from "../components/layout/AppLayout";
import Sidebar from "../components/layout/Sidebar";
import UploadArea from "../components/chat/UploadArea";
import ChatPreview from "../components/chat/ChatPreview";
import { useSelectedChat } from "../state/AppContext";

export function meta() {
  return [
    { title: "CopilotLog - Share your VS Code Copilot Chats" },
    {
      name: "description",
      content: "Upload and share your VS Code Copilot chat conversations",
    },
  ];
}

export default function Home() {
  const selectedChat = useSelectedChat();

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div className="space-y-8">
        {/* Always show upload area */}
        <UploadArea />

        {/* Show preview if chat is selected */}
        {selectedChat ? <ChatPreview /> : null}
      </div>
    </AppLayout>
  );
}

