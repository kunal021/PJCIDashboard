/* eslint-disable react/prop-types */
import { formatTime, getInitials } from "@/lib/utils";
import { MoreVertical, RefreshCcw } from "lucide-react";
import LinkTeacherTopic from "./LinkTeacherTopic";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import InitiateChat from "./InitChat";
import Loader from "@/utils/Loader";

export default function MobileChatList({
  chats,
  onChatSelect,
  onRefresh,
  loading,
  onNextPage,
  onPrevPage,
  currentPage,
  paginationData,
}) {
  if (!chats?.length || loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-white z-30">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>

        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 rounded-md hover:bg-gray-100">
              <MoreVertical className="h-6 w-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="flex flex-col space-y-2">
              <LinkTeacherTopic />
              <InitiateChat />
              <button
                onClick={onRefresh}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-left"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin h-4 w-4" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" />
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-y-auto h-full pb-16">
        {chats?.length > 0 ? (
          chats?.map((chat, idx) => (
            <div
              key={chat?.chat_id + idx}
              onClick={() => onChatSelect(chat)}
              className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {getInitials(chat?.chat_title?.split("_")[1])}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat?.chat_title?.split("_")[1]}
                  </p>
                  <p className="text-sm text-gray-500 break-words whitespace-normal">
                    {chat?.content}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatTime(chat?.time)}
                </span>
                {chat.unreadCount > 0 && (
                  <span className="text-xs rounded-full bg-blue-500 text-white px-2 py-0.5">
                    {chat?.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {loading ? "Loading chats..." : "No chats available"}
          </div>
        )}

        {chats.length > 0 && (
          <div className="flex justify-between items-center px-4 py-2 border-t bg-white sticky bottom-0">
            <button
              onClick={onPrevPage}
              disabled={currentPage <= 1}
              className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {paginationData?.total_pages}
            </span>
            <button
              onClick={onNextPage}
              disabled={currentPage >= paginationData?.total_pages}
              className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
