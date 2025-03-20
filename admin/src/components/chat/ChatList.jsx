/* eslint-disable react/prop-types */
import { RefreshCcw } from "lucide-react";
import { formatTime, getInitials } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";

export default function ChatList({
  chats,
  selectedChat,
  onChatSelect,
  onRefresh,
  loading,
}) {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <SidebarTrigger className="scale-125" />
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          onClick={onRefresh}
          className="p-1 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
        >
          {loading ? (
            <RefreshCcw className="animate-spin h-6 w-6" />
          ) : (
            <RefreshCcw className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div> */}

      <div className="overflow-y-auto h-full pb-16">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.chat_id}
              onClick={() => onChatSelect(chat)}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                selectedChat?.chat_id === chat.chat_id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {getInitials(chat.chat_title.split("_")[1])}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.chat_title?.split("_")[1]}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.content}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-start gap-2">
                  <span className="text-xs text-gray-400">
                    {formatTime(chat.time)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {chat.chat_title?.split("_")[0]}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="text-xs text-red-500">
                      {chat.unreadCount} unread
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {loading ? "Loading chats..." : "No chats available"}
          </div>
        )}
      </div>
    </div>
  );
}
