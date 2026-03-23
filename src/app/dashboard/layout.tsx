'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUserEmail(user.email ?? null);
    });
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (!userEmail) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-stone bg-pale/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-display text-xl text-ink">
            Machikado <span className="text-muted text-base">街角</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
            >
              <span className="hidden sm:inline">{userEmail}</span>
              <span className="w-8 h-8 rounded-full bg-moss text-cream flex items-center justify-center text-xs font-medium">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-pale border border-stone rounded-lg shadow-lg py-1 min-w-[160px] z-50">
                <div className="px-3 py-2 text-xs text-muted border-b border-stone sm:hidden">
                  {userEmail}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-stone/30 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>

      {/* Close menu when clicking outside */}
      {menuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
