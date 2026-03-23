import type { Guide } from "@/types/guide";
import { GuideHero } from "./GuideHero";
import { GuideNav } from "./GuideNav";
import { CardSection } from "./CardSection";
import { EventSection } from "./EventSection";
import { RouteSection } from "./RouteSection";
import { ScheduleSection } from "./ScheduleSection";
import { NoticeBar } from "./NoticeBar";
import { GuideFooter } from "./GuideFooter";

interface Props {
  guide: Guide;
}

export function GuideViewer({ guide }: Props) {
  const sections = guide.sections || [];
  const t = guide.color_theme;

  return (
    <div className="guide-viewer">
      <GuideHero guide={guide} />
      <GuideNav sections={sections} theme={t} />

      {sections.map((section) => {
        switch (section.section_type) {
          case "cards":
            return <CardSection key={section.id} section={section} theme={t} />;
          case "events":
            return <EventSection key={section.id} section={section} theme={t} />;
          case "route":
            return <RouteSection key={section.id} section={section} theme={t} />;
          case "schedule":
            return (
              <ScheduleSection key={section.id} section={section} theme={t} />
            );
          default:
            return null;
        }
      })}

      {guide.notices && guide.notices.length > 0 && (
        <NoticeBar notices={guide.notices} theme={t} />
      )}

      <GuideFooter text={guide.footer_text} theme={t} />
    </div>
  );
}
