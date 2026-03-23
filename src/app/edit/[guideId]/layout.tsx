'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Guide } from '@/types/guide';

export default function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ guideId: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [guideId, setGuideId] = useState<string | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ guideId: id }) => setGuideId(id));
  }, [params]);

  useEffect(() => {
    if (!guideId) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }

      fetch(`/api/guides/${guideId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then((data) => {
          setGuide(data);
          setLoading(false);
        })
        .catch(() => {
          router.push('/dashboard');
        });
    });
  }, [guideId, router]);

  if (loading || !guideId) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center">
        <p className="text-muted">Loading editor...</p>
      </div>
    );
  }

  const tabs = [
    { label: 'Info', href: `/edit/${guideId}` },
    { label: 'Sections', href: `/edit/${guideId}/sections` },
    { label: 'Notices', href: `/edit/${guideId}/notices` },
  ];

  function isActive(href: string) {
    if (href === `/edit/${guideId}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col">
      {/* Top bar */}
      <header className="border-b border-stone bg-pale/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-muted hover:text-ink transition-colors text-sm"
            >
              &larr; Guides
            </Link>
            <span className="text-stone">|</span>
            <h1 className="font-display text-lg text-ink truncate max-w-[200px]">
              {guide?.title ?? 'Guide'}
            </h1>
          </div>

          {guide?.slug && (
            <a
              href={`/g/${guide.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-moss font-medium hover:underline"
            >
              Preview &nearr;
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 w-full">{children}</main>

      {/* Bottom tab nav */}
      <nav className="border-t border-stone bg-pale/90 backdrop-blur-sm sticky bottom-0 z-40">
        <div className="max-w-3xl mx-auto flex">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
                isActive(tab.href)
                  ? 'text-moss border-t-2 border-moss -mt-px'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </Link>
          ))}
          <a
            href={guide?.slug ? `/g/${guide.slug}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            Preview &nearr;
          </a>
        </div>
      </nav>
    </div>
  );
}
