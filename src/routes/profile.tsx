"use client";

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/app-shell";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · StudySpark AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, signOut } = useApp();
  const initials = (user?.name ?? "S")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 glass-strong rounded-3xl p-6 md:p-8 flex items-center gap-5 flex-wrap">
          <div className="size-20 rounded-2xl gradient-primary grid place-items-center text-xl font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs text-muted-foreground">Profile</div>
            <h1 className="font-display text-2xl font-semibold">{user?.name ?? "Student"}</h1>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
          <SparkButton variant="ghost" onClick={signOut}>
            Sign out
          </SparkButton>
        </section>

        <section className="col-span-12 lg:col-span-6 glass rounded-3xl p-6">
          <h3 className="font-display font-semibold">Learning profile</h3>
          {profile ? (
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Course" value={profile.course} />
              <Row label="Semester" value={profile.semester} />
              <Row label="Subjects" value={profile.subjects.join(", ")} />
              <Row
                label="Daily study time"
                value={`${Math.round((profile.dailyStudyMinutes / 60) * 10) / 10}h`}
              />
              <Row label="Learning style" value={profile.learningStyle} />
              <Row label="Goals" value={profile.goals.join(", ")} />
              {profile.examDate && <Row label="Exam date" value={new Date(profile.examDate).toDateString()} />}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Complete onboarding to personalise StudySpark to your goals.
            </p>
          )}
        </section>

        <section className="col-span-12 lg:col-span-6 glass rounded-3xl p-6">
          <h3 className="font-display font-semibold">Account</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Sign-in" value={user?.provider ?? "email"} />
            <Row
              label="Member since"
              value={user ? new Date(user.createdAt).toDateString() : "—"}
            />
          </dl>
        </section>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 glass-subtle rounded-xl px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
