'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/auth-client';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import { NeoCard } from '@/components/neo-brutalist/ui/NeoCard';
import { BrutalistButton } from '@/components/neo-brutalist/ui/BrutalistButton';

export default function LoginPage() {
  const t = useTranslations('login');
  const params = useParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || t('error'));
      } else {
        const locale = params.locale || 'fr';
        router.push(`/${locale}/admin`);
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-neo-border/20 rotate-12" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border-4 border-neo-accent/20 -rotate-6" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-neo-accent/10 rotate-45" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <NeoCard
          variant="default"
          hover="none"
          padding="lg"
          className="border-4 shadow-[8px_8px_0px_0px_var(--neo-shadow)]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-neo-text text-neo-text-inverse px-4 py-1 font-mono text-xs uppercase tracking-widest mb-4">
              Admin
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-neo-text">
              {t('title')}
            </h1>
            <p className="font-mono text-sm text-neo-text/60 mt-2">
              {t('subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-wider text-neo-text/80 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder={t('emailPlaceholder')}
                className="w-full px-4 py-3 bg-neo-surface border-2 border-neo-border text-neo-text font-medium
                  placeholder:text-neo-text/40 focus:outline-none focus:border-neo-accent focus:ring-0
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="font-mono text-xs uppercase tracking-wider text-neo-text/80 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder={t('passwordPlaceholder')}
                className="w-full px-4 py-3 bg-neo-surface border-2 border-neo-border text-neo-text font-medium
                  placeholder:text-neo-text/40 focus:outline-none focus:border-neo-accent focus:ring-0
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-mono text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <BrutalistButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
              icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            >
              {loading ? 'Loading...' : t('submit')}
            </BrutalistButton>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-neo-border/30 text-center">
            <p className="font-mono text-xs text-neo-text/50">
              Espace réservé aux administrateurs
            </p>
          </div>
        </NeoCard>
      </motion.div>
    </div>
  );
}
