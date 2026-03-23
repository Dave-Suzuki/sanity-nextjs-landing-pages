'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { Guide } from '@/types/guide';

export default function GuideInfoPage() {
  const { guideId } = useParams<{ guideId: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [footerText, setFooterText] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    fetch(`/api/guides/${guideId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load guide');
        return res.json();
      })
      .then((data: Guide) => {
        setGuide(data);
        setTitle(data.title);
        setSubtitle(data.subtitle ?? '');
        setSlug(data.slug);
        setTags(data.tags?.join(', ') ?? '');
        setFooterText(data.footer_text ?? '');
        setPublished(data.published);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load guide');
        setLoading(false);
      });
  }, [guideId]);

  const saveField = useCallback(
    async (fields: Record<string, unknown>) => {
      setSaving(true);
      setSaved(false);
      setError(null);

      try {
        const res = await fetch(`/api/guides/${guideId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to save');
        } else {
          const updated = await res.json();
          setGuide(updated);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch {
        setError('Failed to save');
      } finally {
        setSaving(false);
      }
    },
    [guideId]
  );

  function handleBlur(field: string, value: unknown) {
    if (!guide) return;

    const current = guide[field as keyof Guide];
    if (JSON.stringify(current) === JSON.stringify(value)) return;

    saveField({ [field]: value });
  }

  function handlePublishedToggle() {
    const newVal = !published;
    setPublished(newVal);
    saveField({ published: newVal });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">Loading guide info...</p>
      </div>
    );
  }

  if (error && !guide) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-rust">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Guide Info</h2>
        <div className="flex items-center gap-2 text-sm">
          {saving && <span className="text-muted">Saving...</span>}
          {saved && <span className="text-moss">Saved</span>}
          {error && <span className="text-rust">{error}</span>}
        </div>
      </div>

      <div className="bg-pale border border-stone rounded-xl p-4 sm:p-6 space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur('title', title)}
            className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
            placeholder="My Portland Guide"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-ink mb-1">
            Subtitle
          </label>
          <input
            id="subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            onBlur={() => handleBlur('subtitle', subtitle || null)}
            className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
            placeholder="A curated guide to the best spots"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-ink mb-1">
            Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted text-sm shrink-0">/g/</span>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={() => handleBlur('slug', slug)}
              className="flex-1 px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
              placeholder="my-portland-guide"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-ink mb-1">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onBlur={() =>
              handleBlur(
                'tags',
                tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
            placeholder="portland, food, coffee"
          />
          <p className="text-xs text-muted mt-1">Comma-separated</p>
        </div>

        {/* Footer text */}
        <div>
          <label htmlFor="footer" className="block text-sm font-medium text-ink mb-1">
            Footer Text
          </label>
          <textarea
            id="footer"
            rows={3}
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            onBlur={() => handleBlur('footer_text', footerText || null)}
            className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss resize-none"
            placeholder="Made with love in Portland"
          />
        </div>

        {/* Published toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-stone/50">
          <div>
            <p className="text-sm font-medium text-ink">Published</p>
            <p className="text-xs text-muted">Make this guide publicly visible</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={handlePublishedToggle}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              published ? 'bg-moss' : 'bg-stone'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-cream rounded-full transition-transform shadow-sm ${
                published ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
