'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes('/admin') || pathname?.includes('/login');
  
  // Hide global nav/footer on home page as it has its own futuristic design
  // Check for '/', '/en', '/fr', etc.
  const isHomePage = pathname === '/' || pathname?.match(/^\/[a-z]{2}$/);

  if (isAdminRoute) {
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
