import type { Section, ColorTheme } from "@/types/guide";

interface Props {
  section: Section;
  theme: ColorTheme;
}

export function ScheduleSection({ section, theme }: Props) {
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

        <div className="space-y-6">
          {section.schedule_days?.map((day) => (
            <div key={day.id}>
              <h3
                className="mb-3 rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: `${theme.moss}12`, color: theme.moss }}
              >
                {day.label}
              </h3>

              <div className="space-y-2 pl-1">
                {day.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-stone/40 bg-white px-4 py-3"
                  >
                    <span
                      className="shrink-0 text-xs font-semibold pt-0.5"
                      style={{ color: theme.gold }}
                    >
                      {item.time_label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-ink">
                        {item.title}
                      </span>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-muted">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
