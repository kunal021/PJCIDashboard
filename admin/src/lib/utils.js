import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Generate avatar from initials
export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split("_")[0]
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const formatTimeForChat = (timestamp) => {
  if (!timestamp) return "";
  const timeNumber = Number(timestamp);
  if (isNaN(timeNumber) || timeNumber <= 0) {
    console.warn("Invalid timestamp:", timestamp);
    return "Invalid time";
  }

  const dateObj = new Date(timeNumber);
  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date object:", timestamp);
    return "Invalid time";
  }

  return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp));
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const groupMessagesByDate = (messages) => {
  if (!messages) return {};
  return messages.reduce((acc, message) => {
    const dateKey = new Date(Number(message.time)).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(message);
    return acc;
  }, {});
};
