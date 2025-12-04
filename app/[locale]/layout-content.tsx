'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes('/admin') || pathname?.includes('/login');
  
  // Check if current route is one of the Neo-Brutalist pages
  // This regex checks for /en or /fr followed optionally by /about, /services, /albums, /videos, /contact
  // or just the root /en, /fr
  const isNeoPage = /^\/(en|fr)(\/(about|services|albums|videos|contact))?\/?$/.test(pathname || '');

  if (isAdminRoute || isNeoPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
