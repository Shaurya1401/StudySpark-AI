import type { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full p-4 flex gap-4">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <AppTopbar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
