import Link from 'next/link';
import { Home } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-obsidian to-obsidian-50">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-black text-gradient-neon">404</h1>
        <h2 className="mb-6 text-3xl font-bold text-white">{t('notFound')}</h2>
        <p className="mb-8 text-lg text-gray-400">
          {t('pageNotFoundDescription')}
        </p>
        <Link
          href="/"
          className="neon-button inline-flex items-center gap-2"
        >
          <Home className="h-5 w-5" />
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
