"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, LogOut } from "lucide-react";
import { APP_NAV } from "@/constants/nav";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import { useApp } from "@/state/app-store";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useApp();

  const groups: Array<{ label: string; key: "workspace" | "intelligence" | "account" }> = [
    { label: "Workspace", key: "workspace" },
    { label: "Intelligence", key: "intelligence" },
    { label: "Account", key: "account" },
  ];

  const initials = (user?.name ?? "Student")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-4 h-[calc(100dvh-2rem)] glass rounded-3xl p-3">
      <Link to="/" className="flex items-center gap-2 px-3 py-3">
        <span className="grid place-items-center size-8 rounded-xl gradient-primary glow">
          <Sparkles className="size-4 text-primary-foreground" />
        </span>
        <span className="font-display font-semibold tracking-tight">{SITE.name}</span>
      </Link>

      <nav className="flex-1 mt-2 overflow-y-auto pr-1">
        {groups.map((g) => (
          <div key={g.key} className="mt-4 first:mt-0">
            <div className="px-3 mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/80">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {APP_NAV.filter((n) => n.group === g.key).map((n) => {
                const active = pathname === n.to || pathname.startsWith(n.to + "/");
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
                        active
                          ? "bg-white/8 text-foreground glass-subtle"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                      )}
                    >
                      <n.icon className="size-4" />
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="glass-subtle rounded-2xl p-3 mt-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full gradient-primary grid place-items-center text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name ?? "Sign in"}</div>
            <div className="text-xs text-muted-foreground truncate">
              {user?.email ?? "guest"}
            </div>
          </div>
          <Link
            to="/"
            onClick={() => signOut()}
            aria-label="Sign out"
            className="size-8 grid place-items-center rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
