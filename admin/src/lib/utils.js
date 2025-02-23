import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Generate avatar from initials
export const getInitials = (name) => {
  return name
    .split("_")[0]
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};
