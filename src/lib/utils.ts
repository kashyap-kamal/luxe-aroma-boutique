import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TAG_META: Record<string, { label: string; group: "scent" | "occasion" | "other" }> = {
  fresh:          { label: "Fresh & Citrus", group: "scent" },
  aquatic:        { label: "Aquatic",        group: "scent" },
  woody:          { label: "Woody",          group: "scent" },
  floral:         { label: "Floral",         group: "scent" },
  sweet:          { label: "Sweet",          group: "scent" },
  oriental:       { label: "Oriental",       group: "scent" },
  oud:            { label: "Oud",            group: "scent" },
  spicy:          { label: "Spicy",          group: "scent" },
  "office-wear":     { label: "Office Wear",  group: "occasion" },
  "date-night":      { label: "Date Night",   group: "occasion" },
  "everyday-fresh":  { label: "Everyday",     group: "occasion" },
  evening:           { label: "Evening Out",  group: "occasion" },
  "long-lasting":    { label: "Long Lasting", group: "other" },
  "all-season":      { label: "All Season",   group: "other" },
  summer:            { label: "Summer",       group: "other" },
  winter:            { label: "Winter",       group: "other" },
  bestseller:        { label: "Bestseller",   group: "other" },
  "new-launch":      { label: "New Launch",   group: "other" },
};

export function tagLabel(tag: string): string {
  return TAG_META[tag]?.label ?? tag.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
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