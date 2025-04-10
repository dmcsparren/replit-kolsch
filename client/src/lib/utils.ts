import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string, merging 
 * Tailwind CSS classes appropriately
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to display in a readable format
 * e.g. "May 15, 2023"
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a time to display in a readable format
 * e.g. "2:30 PM"
 */
export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Returns a color class based on a status string
 */
export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "critical":
    case "offline":
      return "text-red-500";
    case "warning":
      return "text-yellow-500";
    case "good":
    case "active":
    case "completed":
      return "text-green-500";
    case "in progress":
      return "text-primary";
    case "scheduled":
      return "text-blue-500";
    default:
      return "text-neutral-500";
  }
}

/**
 * Returns a background color class based on a status string
 */
export function getStatusBgColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "critical":
    case "offline":
      return "bg-red-100 text-red-700";
    case "warning":
      return "bg-yellow-100 text-yellow-700";
    case "good":
    case "active":
    case "completed":
      return "bg-green-100 text-green-700";
    case "in progress":
      return "bg-primary bg-opacity-10 text-primary";
    case "scheduled":
      return "bg-neutral-200 text-neutral-700";
    default:
      return "bg-neutral-100 text-neutral-600";
  }
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
