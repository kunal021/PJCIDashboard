/* eslint-disable react/prop-types */
import { formatTime, getInitials } from "@/lib/utils";

export default function MobileChatList({
  chats,
  onChatSelect,
  onRefresh,
  loading,
}) {
  return (
    <div className="fixed inset-0 bg-white z-30">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button
          onClick={onRefresh}
          className="p-1 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-y-auto h-full pb-16">
        {chats.map((chat) => (
          <div
            key={chat.chat_id}
            onClick={() => onChatSelect(chat)}
            className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                {getInitials(chat.chat_title)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {chat.chat_title}
                </p>
                <p className="text-sm text-gray-500 truncate">{chat.content}</p>
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(chat.time)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
