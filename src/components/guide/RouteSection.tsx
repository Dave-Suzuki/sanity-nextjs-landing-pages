import type { Section, ColorTheme } from "@/types/guide";

interface Props {
  section: Section;
  theme: ColorTheme;
}

export function RouteSection({ section, theme }: Props) {
  const stops = section.route_stops || [];

  return (
    <section
      id={section.anchor || section.id}
      className={section.bg_alt ? "section-alt" : ""}
    >
      <div className="px-5 py-10">
        <div className="mb-6">
          {section.section_number && (
            <span
              className="text-xs font-semibold tracking-widest"
              style={{ color: theme.gold }}
            >
              {section.section_number}
            </span>
          )}
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink">
            {section.title}
          </h2>
        </div>

        <div className="relative pl-8">
          {stops.map((stop, i) => (
            <div key={stop.id} className="relative pb-8 last:pb-0">
              {/* Timeline dot */}
              <div
                className="absolute -left-8 top-1.5 h-6 w-6 rounded-full border-[3px]"
                style={{
                  borderColor: theme.moss,
                  background: i === 0 ? theme.moss : theme.cream,
                }}
              />
              {/* Connecting line */}
              {i < stops.length - 1 && (
                <div
                  className="absolute -left-[17px] top-7 bottom-0 w-0.5"
                  style={{ background: theme.stone }}
                />
              )}

              <h3 className="text-base font-semibold text-ink">{stop.title}</h3>
              {stop.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {stop.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
