import { Sparkles } from "lucide-react";
import { SITE } from "@/constants/site";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-10">
      <div className="container mx-auto px-6">
        <div className="glass-strong rounded-3xl p-8 md:p-10 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid place-items-center size-8 rounded-xl gradient-primary glow">
                <Sparkles className="size-4 text-primary-foreground" />
              </span>
              <span className="font-display font-semibold">{SITE.name}</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              An intelligent learning workspace. One upload becomes notes,
              flashcards, quizzes, a planner, and a calm AI mentor.
            </p>
          </div>

          <FooterCol title="Product" links={["Features", "AI Mentor", "Pricing", "Changelog"]} />
          <FooterCol title="Company" links={["About", "Privacy", "Terms", "Contact"]} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground px-2">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Made for students who refuse to settle.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            <a className="hover:text-foreground text-muted-foreground transition-colors" href="#">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
