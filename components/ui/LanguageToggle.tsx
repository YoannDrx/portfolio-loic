'use client';

import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const languages = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
];

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = params.locale as string;

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
      <Globe className="w-4 h-4 text-gray-400" />

      <div className="flex items-center gap-1">
        {languages.map((lang) => {
          const isActive = currentLocale === lang.code;

          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isPending}
              className={`relative px-2 py-1 text-xs font-semibold rounded transition-all ${
                isActive
                  ? 'text-neon-cyan'
                  : 'text-gray-400 hover:text-white disabled:opacity-50'
              }`}
              title={lang.name}
            >
              {isActive && (
                <motion.div
                  layoutId="language-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30 rounded"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
