import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function categoryNameMap(category: string) {
  switch (category) {
    case "men":
      return "Men's Collection";
    case "women":
      return "Women's Collection";
    case "unisex":
      return "Unisex Collection";
    default:
      return category;
  }
}