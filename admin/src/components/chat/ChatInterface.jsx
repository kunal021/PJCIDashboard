import { useState, useEffect } from "react";
import axios from "axios";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { API_URL } from "@/url";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import MobileChatList from "./MobileChatList";

export default function ChatInterface() {
  const { authToken } = useAuth();
  const isMobileView = useIsMobile();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Tab is active again, refreshing data...");
        loadChats();
        if (selectedChat) {
          handleChatSelect(selectedChat);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const data = new FormData();
      data.append("userid", authToken?.number);
      data.append("role", authToken?.role);
      data.append("page", "1");
      data.append("limit", "20");

      const response = await axios.post(
        `${API_URL}/doubt/getchatlist.php`,
        data,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching chat list:", error);
      return [];
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("limit", "100");
      formData.append("page", "1");

      const response = await axios.post(
        `${API_URL}/doubt/getchatmessages.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  const handleSendMessage = async (content) => {
    try {
      const formData = new FormData();
      formData.append("action", "send_message");
      formData.append("chat_id", selectedChat.chat_id);
      formData.append("sender_id", authToken?.number);
      formData.append("sender_name", authToken?.name);
      formData.append("message_type", "text");
      formData.append("content", content);
      formData.append("time", Date.now().toString());

      const response = await axios.post(
        `${API_URL}/doubt/sendmessage.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setMessages((prev) => [response.data.payload, ...prev]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const loadChats = async () => {
    setLoading(true);
    try {
      const fetchedChats = await fetchChats();
      setChats(fetchedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    setLoading(true);
    try {
      const fetchedMessages = await fetchMessages(chat.chat_id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
    if (isMobileView) {
      setShowChatList(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {!isMobileView && (
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          onRefresh={loadChats}
          loading={loading}
        />
      )}
      <ChatArea
        selectedChat={selectedChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        onBackToList={() => setShowChatList(true)}
        isMobileView={isMobileView}
        currentUserId={authToken?.number}
      />
      {isMobileView && showChatList && (
        <MobileChatList
          chats={chats}
          onChatSelect={handleChatSelect}
          onRefresh={loadChats}
          loading={loading}
        />
      )}
    </div>
  );
}
