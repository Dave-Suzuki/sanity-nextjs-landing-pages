import type { Notice, ColorTheme } from "@/types/guide";

interface Props {
  notices: Notice[];
  theme: ColorTheme;
}

export function NoticeBar({ notices, theme }: Props) {
  if (!notices || notices.length === 0) return null;

  return (
    <div
      className="px-5 py-10"
      style={{ background: theme.ink, color: theme.cream }}
    >
      <h2
        className="mb-6 text-center font-display text-2xl font-normal"
        style={{ color: theme.gold }}
      >
        Tips &amp; Notes
      </h2>
      <div className="grid gap-4">
        {notices.map((notice, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{ background: `${theme.cream}0D` }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-lg">{notice.emoji}</span>
              <span className="text-sm font-semibold" style={{ color: theme.gold }}>
                {notice.title}
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">{notice.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
