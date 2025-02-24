/* eslint-disable react/prop-types */

import { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { formatTime, getInitials } from "@/lib/utils";

export default function ChatArea({
  selectedChat,
  messages,
  onSendMessage,
  onBackToList,
  isMobileView,
  currentUserId,
  sendLoading,
}) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-2">
            Select a chat to view messages
          </h2>
          <p className="text-gray-500 mb-4">
            Or use the button to refresh the chat list
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border-2">
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center">
        {isMobileView && (
          <button className="mr-3 text-gray-500" onClick={onBackToList}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
            {getInitials(selectedChat.chat_title.split("_")[1])}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {selectedChat.chat_title.split("_")[1]}
            </h2>
            <p className="text-sm text-gray-500">{selectedChat.chat_type}</p>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 h-screen flex flex-col-reverse">
        {sendLoading && (
          <div className="mb-4 flex justify-end">
            <div className="max-w-xs p-3 rounded-lg shadow-sm border bg-gray-100 text-black border-gray-300">
              <div className="text-xs text-gray-400">Sending...</div>
            </div>
          </div>
        )}
        {messages?.reverse().map((message) => {
          const isCurrentUser = message.sender_id === currentUserId;

          return (
            <div
              key={message.id}
              className={`mb-4 flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 ${
                  isCurrentUser ? "flex-row-reverse" : ""
                }`}
              >
                {!isCurrentUser && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    {message.sender_name.charAt(0)}
                  </div>
                )}
                <div
                  className={`max-w-xs p-3 rounded-lg shadow-sm border ${
                    isCurrentUser
                      ? "bg-gray-100 text-black border-gray-300"
                      : "bg-white text-gray-800 border-gray-200"
                  }`}
                >
                  <div className="flex items-baseline space-x-2">
                    {!isCurrentUser && (
                      <span className="font-medium text-gray-900">
                        {message.sender_name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatTime(message.time)}
                    </span>
                  </div>
                  <div className="mt-1">{message.content}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={sendLoading}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-indigo-600 text-white"
            disabled={sendLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
