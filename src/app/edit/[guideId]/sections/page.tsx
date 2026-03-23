'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type {
  Section,
  SectionType,
  Subsection,
  Spot,
  GuideEvent,
  RouteStop,
  ScheduleDay,
  ScheduleItem,
} from '@/types/guide';

const SECTION_TYPE_ICONS: Record<SectionType, string> = {
  cards: '\u{1F0CF}',
  events: '\u{1F4C5}',
  route: '\u{1F6B6}',
  schedule: '\u{1F552}',
};

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  cards: 'Cards',
  events: 'Events',
  route: 'Route',
  schedule: 'Schedule',
};

export default function SectionsPage() {
  const { guideId } = useParams<{ guideId: string }>();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<SectionType>('cards');
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchSections = useCallback(async () => {
    const res = await fetch(`/api/guides/${guideId}/full`);
    if (res.ok) {
      const data = await res.json();
      setSections(
        (data.sections ?? []).sort(
          (a: Section, b: Section) => a.sort_order - b.sort_order
        )
      );
    }
    setLoading(false);
  }, [guideId]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    const res = await fetch('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guide_id: guideId,
        title: newTitle,
        section_type: newType,
        sort_order: sections.length,
        bg_alt: false,
      }),
    });

    if (res.ok) {
      setNewTitle('');
      setShowAdd(false);
      fetchSections();
    }
    setCreating(false);
  }

  async function handleDeleteSection(sectionId: string, title: string) {
    if (!confirm(`Delete section "${title}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/sections/${sectionId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      if (expandedId === sectionId) setExpandedId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">Loading sections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Sections</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-moss text-cream text-sm font-medium px-4 py-2 rounded-lg hover:bg-moss/90 transition-colors"
        >
          {showAdd ? 'Cancel' : '+ Add Section'}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddSection}
          className="bg-pale border border-stone rounded-xl p-4 space-y-3"
        >
          <div>
            <label
              htmlFor="section-type"
              className="block text-sm font-medium text-ink mb-1"
            >
              Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                Object.keys(SECTION_TYPE_LABELS) as SectionType[]
              ).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewType(type)}
                  className={`text-center py-2 rounded-lg text-sm font-medium transition-colors border ${
                    newType === type
                      ? 'bg-moss text-cream border-moss'
                      : 'bg-cream text-ink border-stone hover:border-moss/50'
                  }`}
                >
                  <span className="block text-lg mb-0.5">
                    {SECTION_TYPE_ICONS[type]}
                  </span>
                  {SECTION_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="section-title"
              className="block text-sm font-medium text-ink mb-1"
            >
              Title
            </label>
            <input
              id="section-title"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
              placeholder="Section title"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !newTitle.trim()}
            className="bg-moss text-cream text-sm font-medium px-4 py-2 rounded-lg hover:bg-moss/90 transition-colors disabled:opacity-50"
          >
            {creating ? 'Adding...' : 'Add Section'}
          </button>
        </form>
      )}

      {sections.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted mb-1">No sections yet</p>
          <p className="text-sm text-muted/70">
            Add a section to start building your guide.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-pale border border-stone rounded-xl overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 p-4">
                <span className="text-xl">
                  {SECTION_TYPE_ICONS[section.section_type]}
                </span>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === section.id ? null : section.id
                      )
                    }
                    className="text-left w-full"
                  >
                    <p className="font-medium text-ink truncate">
                      {section.title}
                    </p>
                    <p className="text-xs text-muted">
                      {SECTION_TYPE_LABELS[section.section_type]} &middot;
                      Order: {section.sort_order}
                    </p>
                  </button>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === section.id ? null : section.id
                      )
                    }
                    className="text-sm text-moss font-medium px-2 py-1 rounded hover:bg-moss/10 transition-colors"
                  >
                    {expandedId === section.id ? 'Collapse' : 'Edit'}
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteSection(section.id, section.title)
                    }
                    className="text-sm text-rust/70 font-medium px-2 py-1 rounded hover:bg-rust/10 hover:text-rust transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded inline editor */}
              {expandedId === section.id && (
                <div className="border-t border-stone/50 p-4">
                  <SectionEditor
                    section={section}
                    onUpdate={fetchSections}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline section editor                                              */
/* ------------------------------------------------------------------ */

function SectionEditor({
  section,
  onUpdate,
}: {
  section: Section;
  onUpdate: () => void;
}) {
  const [title, setTitle] = useState(section.title);
  const [sortOrder, setSortOrder] = useState(String(section.sort_order));
  const [navLabel, setNavLabel] = useState(section.nav_label ?? '');
  const [bgAlt, setBgAlt] = useState(section.bg_alt);
  const [saving, setSaving] = useState(false);

  async function saveSection() {
    setSaving(true);
    await fetch(`/api/sections/${section.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        sort_order: parseInt(sortOrder, 10) || 0,
        nav_label: navLabel || null,
        bg_alt: bgAlt,
      }),
    });
    setSaving(false);
    onUpdate();
  }

  return (
    <div className="space-y-4">
      {/* Section fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveSection}
            className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Nav Label
          </label>
          <input
            type="text"
            value={navLabel}
            onChange={(e) => setNavLabel(e.target.value)}
            onBlur={saveSection}
            className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
            placeholder="Short label for nav"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            onBlur={saveSection}
            className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
          />
        </div>
        <div className="flex items-center gap-2 self-end pb-2">
          <button
            type="button"
            role="switch"
            aria-checked={bgAlt}
            onClick={() => {
              setBgAlt(!bgAlt);
              // save after state update
              setTimeout(() => {
                fetch(`/api/sections/${section.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ bg_alt: !bgAlt }),
                }).then(() => onUpdate());
              }, 0);
            }}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              bgAlt ? 'bg-moss' : 'bg-stone'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-cream rounded-full transition-transform shadow-sm ${
                bgAlt ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-xs text-muted">Alt background</span>
        </div>
      </div>

      {saving && (
        <p className="text-xs text-muted">Saving...</p>
      )}

      {/* Type-specific content */}
      <div className="border-t border-stone/30 pt-4">
        {section.section_type === 'cards' && (
          <CardsEditor section={section} />
        )}
        {section.section_type === 'events' && (
          <EventsEditor section={section} />
        )}
        {section.section_type === 'route' && (
          <RouteEditor section={section} />
        )}
        {section.section_type === 'schedule' && (
          <ScheduleEditor section={section} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cards (subsections + spots) editor                                 */
/* ------------------------------------------------------------------ */

function CardsEditor({ section }: { section: Section }) {
  const subsections = (section.subsections ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">
        Subsections &amp; Spots
      </p>
      {subsections.length === 0 ? (
        <p className="text-sm text-muted/70 py-4 text-center">
          No subsections yet. Add them via the database for now.
        </p>
      ) : (
        subsections.map((sub: Subsection) => (
          <div
            key={sub.id}
            className="bg-cream border border-stone/50 rounded-lg p-3"
          >
            <p className="font-medium text-sm text-ink mb-2">
              {sub.title}
            </p>
            {(sub.spots ?? [])
              .sort((a: Spot, b: Spot) => a.sort_order - b.sort_order)
              .map((spot: Spot) => (
                <div
                  key={spot.id}
                  className="flex items-center gap-2 py-1.5 border-b border-stone/20 last:border-0"
                >
                  <span className="text-base">{spot.fallback_emoji}</span>
                  <span className="text-sm text-ink">{spot.name}</span>
                  {spot.description && (
                    <span className="text-xs text-muted truncate">
                      &mdash; {spot.description}
                    </span>
                  )}
                </div>
              ))}
            {(sub.spots ?? []).length === 0 && (
              <p className="text-xs text-muted/50">No spots</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Events editor                                                      */
/* ------------------------------------------------------------------ */

function EventsEditor({ section }: { section: Section }) {
  const events = (section.events ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">
        Events
      </p>
      {events.length === 0 ? (
        <p className="text-sm text-muted/70 py-4 text-center">
          No events yet. Add them via the database for now.
        </p>
      ) : (
        events.map((evt: GuideEvent) => (
          <div
            key={evt.id}
            className="bg-cream border border-stone/50 rounded-lg p-3 flex items-start gap-3"
          >
            <div className="bg-stone/30 rounded-lg px-2 py-1 text-center shrink-0">
              <p className="text-xs font-medium text-ink">
                {evt.date_label}
              </p>
              {evt.day_label && (
                <p className="text-xs text-muted">{evt.day_label}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{evt.title}</p>
              {evt.description && (
                <p className="text-xs text-muted mt-0.5">
                  {evt.description}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Route editor                                                       */
/* ------------------------------------------------------------------ */

function RouteEditor({ section }: { section: Section }) {
  const stops = (section.route_stops ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">
        Route Stops
      </p>
      {stops.length === 0 ? (
        <p className="text-sm text-muted/70 py-4 text-center">
          No route stops yet. Add them via the database for now.
        </p>
      ) : (
        <div className="space-y-2">
          {stops.map((stop: RouteStop, i: number) => (
            <div
              key={stop.id}
              className="bg-cream border border-stone/50 rounded-lg p-3 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-moss text-cream text-xs flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{stop.title}</p>
                {stop.description && (
                  <p className="text-xs text-muted mt-0.5">
                    {stop.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Schedule editor                                                    */
/* ------------------------------------------------------------------ */

function ScheduleEditor({ section }: { section: Section }) {
  const days = (section.schedule_days ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">
        Schedule
      </p>
      {days.length === 0 ? (
        <p className="text-sm text-muted/70 py-4 text-center">
          No schedule days yet. Add them via the database for now.
        </p>
      ) : (
        days.map((day: ScheduleDay) => (
          <div
            key={day.id}
            className="bg-cream border border-stone/50 rounded-lg p-3"
          >
            <p className="font-medium text-sm text-ink mb-2">{day.label}</p>
            {(day.items ?? [])
              .sort(
                (a: ScheduleItem, b: ScheduleItem) =>
                  a.sort_order - b.sort_order
              )
              .map((item: ScheduleItem) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 py-1.5 border-b border-stone/20 last:border-0"
                >
                  <span className="text-xs font-medium text-moss bg-moss/10 px-1.5 py-0.5 rounded shrink-0">
                    {item.time_label}
                  </span>
                  <div>
                    <p className="text-sm text-ink">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            {(day.items ?? []).length === 0 && (
              <p className="text-xs text-muted/50">No items</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
