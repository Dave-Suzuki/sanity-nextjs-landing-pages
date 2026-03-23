import type { Section, ColorTheme } from "@/types/guide";
import { SpotCard } from "./SpotCard";

interface Props {
  section: Section;
  theme: ColorTheme;
}

export function CardSection({ section, theme }: Props) {
  return (
    <section
      id={section.anchor || section.id}
      className={section.bg_alt ? "section-alt" : ""}
    >
      <div className="px-5 py-10">
        {/* Section header */}
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

        {/* Subsections with spots */}
        {section.subsections?.map((sub) => (
          <div key={sub.id} className="mb-8">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted">
              {sub.title}
            </h3>
            <div className="grid gap-4">
              {sub.spots?.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
