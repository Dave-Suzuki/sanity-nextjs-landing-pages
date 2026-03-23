import type { Section, ColorTheme } from "@/types/guide";

interface Props {
  section: Section;
  theme: ColorTheme;
}

export function EventSection({ section, theme }: Props) {
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

        <div className="grid gap-3">
          {section.events?.map((event) => (
            <div
              key={event.id}
              className="flex gap-4 rounded-2xl border border-stone/60 bg-white p-4"
            >
              {/* Date badge */}
              <div
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl"
                style={{ background: theme.moss, color: theme.cream }}
              >
                <span className="text-lg font-bold leading-none">
                  {event.date_label}
                </span>
                {event.day_label && (
                  <span className="mt-0.5 text-[10px] uppercase opacity-70">
                    {event.day_label}
                  </span>
                )}
              </div>

              {/* Event info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-ink">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="mt-0.5 text-sm text-muted">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
