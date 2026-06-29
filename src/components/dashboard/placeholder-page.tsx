import type { ReactNode } from "react";
import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { SparkButton } from "@/components/ui/spark-button";

export function PlaceholderPage({
  icon,
  title,
  description,
  cta,
  extra,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  cta?: string;
  extra?: ReactNode;
}) {
  return (
    <AppShell>
      <div className="glass-strong rounded-3xl p-8 md:p-12">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          action={cta ? <SparkButton>{cta}</SparkButton> : undefined}
        />
        {extra}
      </div>
    </AppShell>
  );
}
