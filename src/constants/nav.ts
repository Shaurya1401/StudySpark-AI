import {
  LayoutDashboard,
  CalendarRange,
  FileText,
  Layers,
  Brain,
  Sparkles,
  LineChart,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type AppNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  group: "workspace" | "intelligence" | "account";
};

export const APP_NAV: AppNavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, group: "workspace" },
  { label: "Planner", to: "/planner", icon: CalendarRange, group: "workspace" },
  { label: "Notes", to: "/notes", icon: FileText, group: "workspace" },
  { label: "Flashcards", to: "/flashcards", icon: Layers, group: "workspace" },
  { label: "Quiz", to: "/quiz", icon: Brain, group: "intelligence" },
  { label: "AI Mentor", to: "/mentor", icon: Sparkles, group: "intelligence" },
  { label: "Analytics", to: "/analytics", icon: LineChart, group: "intelligence" },
  { label: "Profile", to: "/profile", icon: UserRound, group: "account" },
  { label: "Settings", to: "/settings", icon: Settings, group: "account" },
];
