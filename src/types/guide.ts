export interface Guide {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  tags: string[];
  color_theme: ColorTheme;
  published: boolean;
  created_at: string;
  updated_at: string;
  sections?: Section[];
  notices?: Notice[];
  footer_text?: string | null;
}

export interface ColorTheme {
  cream: string;
  stone: string;
  moss: string;
  rust: string;
  ink: string;
  muted: string;
  pale: string;
  gold: string;
}

export const DEFAULT_THEME: ColorTheme = {
  cream: "#F5F0E8",
  stone: "#E2D9C8",
  moss: "#3D5240",
  rust: "#B85C38",
  ink: "#1A1A18",
  muted: "#7A7060",
  pale: "#FAF7F2",
  gold: "#C4963A",
};

export interface Notice {
  emoji: string;
  title: string;
  text: string;
}

export type SectionType = "cards" | "events" | "route" | "schedule";

export interface Section {
  id: string;
  guide_id: string;
  title: string;
  section_number: string | null;
  nav_label: string | null;
  anchor: string | null;
  section_type: SectionType;
  bg_alt: boolean;
  sort_order: number;
  subsections?: Subsection[];
  events?: GuideEvent[];
  route_stops?: RouteStop[];
  schedule_days?: ScheduleDay[];
}

export interface Subsection {
  id: string;
  section_id: string;
  title: string;
  sort_order: number;
  spots?: Spot[];
}

export interface Spot {
  id: string;
  subsection_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  fallback_emoji: string;
  google_maps_query: string | null;
  sort_order: number;
  badges?: SpotBadge[];
  meta?: SpotMeta[];
}

export type BadgeType =
  | "dog"
  | "togo"
  | "dm"
  | "jp"
  | "hot"
  | "free"
  | "delivery"
  | "custom";

export interface SpotBadge {
  id: string;
  spot_id: string;
  label: string;
  badge_type: BadgeType;
  sort_order: number;
}

export interface SpotMeta {
  id: string;
  spot_id: string;
  icon: string;
  value: string;
  sort_order: number;
}

export interface GuideEvent {
  id: string;
  section_id: string;
  date_label: string;
  day_label: string | null;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface RouteStop {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface ScheduleDay {
  id: string;
  section_id: string;
  label: string;
  sort_order: number;
  items?: ScheduleItem[];
}

export interface ScheduleItem {
  id: string;
  schedule_day_id: string;
  time_label: string;
  title: string;
  description: string | null;
  sort_order: number;
}
