import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/constants/site";
import { SparkButton } from "@/components/ui/spark-button";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,calc(100%-2rem))]",
        "transition-all duration-300",
      )}
    >
      <nav
        className={cn(
          "glass rounded-full px-3 md:px-5 flex items-center justify-between",
          scrolled ? "py-2" : "py-2.5",
        )}
        aria-label="Primary"
      >
        <Link to="/" className="flex items-center gap-2 pl-2 pr-3 group">
          <span className="grid place-items-center size-8 rounded-xl gradient-primary glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </span>
          <span className="font-display font-semibold tracking-tight">
            {SITE.name}
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 text-sm">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="px-3 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth">
            <SparkButton variant="ghost" size="sm">Login</SparkButton>
          </Link>
          <Link to="/dashboard">
            <SparkButton size="sm">Start Learning Free</SparkButton>
          </Link>
        </div>

        <button
          className="md:hidden grid place-items-center size-9 rounded-full glass-subtle"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open ? (
        <div className="md:hidden mt-2 glass rounded-3xl p-3 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/auth" className="flex-1">
              <SparkButton variant="glass" size="sm" className="w-full">Login</SparkButton>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <SparkButton size="sm" className="w-full">Start Free</SparkButton>
            </Link>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
