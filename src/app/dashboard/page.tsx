'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Guide } from '@/types/guide';
import { DEFAULT_THEME } from '@/types/guide';

export default function DashboardPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchGuides() {
    const res = await fetch('/api/guides');
    if (res.ok) {
      const data = await res.json();
      setGuides(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchGuides();
  }, []);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);

    const slug = newSlug || slugify(newTitle);

    const res = await fetch('/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        slug,
        color_theme: DEFAULT_THEME,
        published: false,
        tags: [],
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to create guide');
      setCreating(false);
      return;
    }

    setNewTitle('');
    setNewSlug('');
    setShowCreate(false);
    setCreating(false);
    fetchGuides();
  }

  async function handleDelete(guideId: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/guides/${guideId}`, { method: 'DELETE' });
    if (res.ok) {
      setGuides((prev) => prev.filter((g) => g.id !== guideId));
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">Loading guides...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Your Guides</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-moss text-cream text-sm font-medium px-4 py-2 rounded-lg hover:bg-moss/90 transition-colors"
        >
          {showCreate ? 'Cancel' : '+ New Guide'}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-pale border border-stone rounded-xl p-4 mb-6 space-y-3"
        >
          {error && (
            <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="new-title" className="block text-sm font-medium text-ink mb-1">
              Title
            </label>
            <input
              id="new-title"
              type="text"
              required
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (!newSlug) {
                  // auto-generate slug hint but don't lock it
                }
              }}
              className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
              placeholder="My Portland Guide"
            />
          </div>
          <div>
            <label htmlFor="new-slug" className="block text-sm font-medium text-ink mb-1">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm">/g/</span>
              <input
                id="new-slug"
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="flex-1 px-3 py-2 bg-cream border border-stone rounded-lg text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
                placeholder={slugify(newTitle) || 'my-portland-guide'}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating || !newTitle.trim()}
            className="bg-moss text-cream text-sm font-medium px-4 py-2 rounded-lg hover:bg-moss/90 transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Guide'}
          </button>
        </form>
      )}

      {guides.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted mb-2">No guides yet</p>
          <p className="text-sm text-muted/70">
            Create your first guide to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-pale border border-stone rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link
                    href={`/edit/${guide.id}`}
                    className="font-display text-lg text-ink hover:text-moss transition-colors leading-snug"
                  >
                    {guide.title}
                  </Link>
                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                      guide.published
                        ? 'bg-moss/15 text-moss'
                        : 'bg-stone/50 text-muted'
                    }`}
                  >
                    {guide.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <p className="text-sm text-muted mb-2">/g/{guide.slug}</p>

                {guide.tags && guide.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-stone/30 text-muted px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted/70">
                  Updated {formatDate(guide.updated_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-stone/50">
                <Link
                  href={`/edit/${guide.id}`}
                  className="flex-1 text-center text-sm text-moss font-medium py-1.5 rounded-lg hover:bg-moss/10 transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/g/${guide.slug}`}
                  target="_blank"
                  className="flex-1 text-center text-sm text-muted font-medium py-1.5 rounded-lg hover:bg-stone/30 transition-colors"
                >
                  Preview
                </Link>
                <button
                  onClick={() => handleDelete(guide.id, guide.title)}
                  className="text-sm text-rust/70 font-medium py-1.5 px-3 rounded-lg hover:bg-rust/10 hover:text-rust transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
