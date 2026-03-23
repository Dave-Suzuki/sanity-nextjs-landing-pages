import type { BadgeType } from "@/types/guide";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function mapsUrl(query: string) {
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

export const BADGE_STYLES: Record<BadgeType, { bg: string; text: string }> = {
  dog: { bg: "bg-badge-dog-bg", text: "text-badge-dog-text" },
  togo: { bg: "bg-badge-togo-bg", text: "text-badge-togo-text" },
  dm: { bg: "bg-badge-dm-bg", text: "text-badge-dm-text" },
  jp: { bg: "bg-badge-jp-bg", text: "text-badge-jp-text" },
  hot: { bg: "bg-badge-hot-bg", text: "text-badge-hot-text" },
  free: { bg: "bg-badge-free-bg", text: "text-badge-free-text" },
  delivery: { bg: "bg-badge-delivery-bg", text: "text-badge-delivery-text" },
  custom: { bg: "bg-stone/40", text: "text-ink" },
};
