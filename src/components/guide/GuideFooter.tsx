import type { ColorTheme } from "@/types/guide";

interface Props {
  text?: string | null;
  theme: ColorTheme;
}

export function GuideFooter({ text, theme }: Props) {
  return (
    <footer
      className="px-5 py-8 text-center text-xs"
      style={{ background: theme.moss, color: `${theme.cream}99` }}
    >
      {text && <p className="mb-2">{text}</p>}
      <p>
        Built with{" "}
        <span className="font-semibold" style={{ color: theme.gold }}>
          Machikado 街角
        </span>
      </p>
    </footer>
  );
}
