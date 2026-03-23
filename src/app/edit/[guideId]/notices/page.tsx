'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { Notice } from '@/types/guide';

export default function NoticesPage() {
  const { guideId } = useParams<{ guideId: string }>();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/guides/${guideId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        setNotices(data.notices ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load notices');
        setLoading(false);
      });
  }, [guideId]);

  const saveNotices = useCallback(
    async (updated: Notice[]) => {
      setSaving(true);
      setSaved(false);
      setError(null);

      try {
        const res = await fetch(`/api/guides/${guideId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notices: updated }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to save');
        } else {
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

  function updateNotice(index: number, field: keyof Notice, value: string) {
    setNotices((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function handleBlur() {
    saveNotices(notices);
  }

  function addNotice() {
    const updated = [...notices, { emoji: '\u{1F4CC}', title: '', text: '' }];
    setNotices(updated);
  }

  function removeNotice(index: number) {
    const updated = notices.filter((_, i) => i !== index);
    setNotices(updated);
    saveNotices(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Notices</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm">
            {saving && <span className="text-muted">Saving...</span>}
            {saved && <span className="text-moss">Saved</span>}
            {error && <span className="text-rust">{error}</span>}
          </div>
          <button
            onClick={addNotice}
            className="bg-moss text-cream text-sm font-medium px-4 py-2 rounded-lg hover:bg-moss/90 transition-colors"
          >
            + Add Notice
          </button>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted mb-1">No notices yet</p>
          <p className="text-sm text-muted/70">
            Add notices to display important info at the top of your guide.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="bg-pale border border-stone rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-muted">
                  Notice {index + 1}
                </span>
                <button
                  onClick={() => removeNotice(index)}
                  className="text-sm text-rust/70 font-medium px-2 py-0.5 rounded hover:bg-rust/10 hover:text-rust transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-[4rem_1fr] gap-3">
                {/* Emoji */}
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={notice.emoji}
                    onChange={(e) =>
                      updateNotice(index, 'emoji', e.target.value)
                    }
                    onBlur={handleBlur}
                    className="w-full px-2 py-2 bg-cream border border-stone rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
                    maxLength={4}
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notice.title}
                    onChange={(e) =>
                      updateNotice(index, 'title', e.target.value)
                    }
                    onBlur={handleBlur}
                    className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
                    placeholder="Notice title"
                  />
                </div>
              </div>

              {/* Text */}
              <div>
                <label className="block text-xs font-medium text-ink mb-1">
                  Text
                </label>
                <textarea
                  rows={2}
                  value={notice.text}
                  onChange={(e) =>
                    updateNotice(index, 'text', e.target.value)
                  }
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-ink text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss resize-none"
                  placeholder="Notice description..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
