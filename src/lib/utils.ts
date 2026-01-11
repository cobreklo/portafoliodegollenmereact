import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url?: string | null, fallback = '/assets/img/cd_stopped.png'): string {
  if (!url || url.trim() === '') return fallback;
  return url;
}
