import type { Spot } from "@/types/guide";
import { BADGE_STYLES, mapsUrl, cn } from "@/lib/utils";

interface Props {
  spot: Spot;
}

export function SpotCard({ spot }: Props) {
  return (
    <div className="rounded-2xl border border-stone/60 bg-white p-4 shadow-sm">
      {/* Thumbnail */}
      {spot.image_url ? (
        <img
          src={spot.image_url}
          alt={spot.name}
          className="card-thumb mb-3 w-full"
          loading="lazy"
        />
      ) : (
        <div className="card-thumb mb-3 flex w-full items-center justify-center rounded-[0.625rem] bg-stone/30 text-4xl">
          {spot.fallback_emoji || "📍"}
        </div>
      )}

      {/* Badges */}
      {spot.badges && spot.badges.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {spot.badges.map((b) => {
            const style = BADGE_STYLES[b.badge_type] || BADGE_STYLES.custom;
            return (
              <span
                key={b.id}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  style.bg,
                  style.text
                )}
              >
                {b.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Name */}
      <h3 className="text-base font-semibold leading-snug text-ink">
        {spot.google_maps_query ? (
          <a
            href={mapsUrl(spot.google_maps_query)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-moss transition-colors"
          >
            {spot.name}
            <span className="ml-1 text-muted text-xs">↗</span>
          </a>
        ) : (
          spot.name
        )}
      </h3>

      {/* Description */}
      {spot.description && (
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {spot.description}
        </p>
      )}

      {/* Meta rows */}
      {spot.meta && spot.meta.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-stone/40 pt-3">
          {spot.meta.map((m) => (
            <div key={m.id} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-base leading-5">{m.icon}</span>
              <span className="text-muted leading-5">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
