import type { Guide } from "@/types/guide";

interface Props {
  guide: Guide;
}

export function GuideHero({ guide }: Props) {
  const t = guide.color_theme;

  return (
    <header
      className="relative overflow-hidden px-6 pb-16 pt-20 text-center"
      style={{ background: t.moss, color: t.cream }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 65% 35%, ${t.gold}2E 0%, transparent 65%)`,
        }}
      />

      <p
        className="relative mb-4 text-[11px] font-medium uppercase tracking-[0.28em]"
        style={{ color: t.gold }}
      >
        {guide.subtitle || "Travel Guide"}
      </p>

      <h1 className="relative font-display text-[clamp(3rem,7vw,5.5rem)] font-normal leading-[1.05] tracking-tight">
        {guide.title.includes(",") ? (
          guide.title.split(",").map((part, i) =>
            i === 0 ? (
              <span key={i}>
                {part},
                <br />
              </span>
            ) : (
              <em key={i} className="italic" style={{ color: t.gold }}>
                {part.trim()}
              </em>
            )
          )
        ) : (
          <span>{guide.title}</span>
        )}
      </h1>

      {guide.tags.length > 0 && (
        <div className="relative mt-7 flex flex-wrap justify-center gap-2">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-3.5 py-1.5 text-xs"
              style={{
                background: `${t.cream}1A`,
                borderColor: `${t.cream}33`,
                color: t.cream,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
