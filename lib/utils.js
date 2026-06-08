import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDefaultAvatarUrl(username) {
  const seed = username || "default";
  return `https://api.dicebear.com/10.x/fun-emoji/svg?seed=${encodeURIComponent(seed)}`;
}

export function isAdminEmail(email) {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}
