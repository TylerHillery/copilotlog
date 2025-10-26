import AppLayout from "../components/layout/app-layout";
import Sidebar from "../components/layout/sidebar";
import UploadArea from "../components/chat/upload-area";
import ChatPreview from "../components/chat/chat-preview";
import { useSelectedChat } from "../state/app-context";

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

