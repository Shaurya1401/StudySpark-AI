"use client";

import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/state/app-store";
import type { ReactNode } from "react";

export function Protected({ children }: { children: ReactNode }) {
  const { ready, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth" });
  }, [ready, user, navigate]);

  if (!ready) {
    return (
      <div className="grid place-items-center min-h-dvh">
        <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}
