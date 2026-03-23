"use client";

import { cn } from "@/lib/utils";
import type { Section } from "@/types/guide";
import type { ColorTheme } from "@/types/guide";
import { useState, useEffect } from "react";

interface Props {
  sections: Section[];
  theme: ColorTheme;
}

export function GuideNav({ sections, theme }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const s of sections) {
      const el = document.getElementById(s.anchor || s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const navItems = sections.filter((s) => s.nav_label);

  if (navItems.length === 0) return null;

  return (
    <nav
      className="guide-nav border-b px-4 py-2.5"
      style={{
        background: `${theme.cream}E6`,
        borderColor: `${theme.stone}80`,
      }}
    >
      <div className="flex gap-1 overflow-x-auto hide-scrollbar">
        {navItems.map((s) => {
          const isActive = active === (s.anchor || s.id);
          return (
            <a
              key={s.id}
              href={`#${s.anchor || s.id}`}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "text-white"
                  : "text-muted hover:text-ink"
              )}
              style={isActive ? { background: theme.moss } : undefined}
            >
              {s.nav_label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
