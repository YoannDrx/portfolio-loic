"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { BrutalistButton } from '../ui/BrutalistButton';

interface NeoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NeoLoginModal({ isOpen, onClose }: NeoLoginModalProps) {
  const t = useTranslations('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();

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
        window.location.href = `/${locale}/admin`;
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neo-text/80 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-neo-bg border-4 border-neo-border shadow-[8px_8px_0px_0px_var(--neo-shadow)]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b-4 border-neo-border bg-neo-accent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neo-text flex items-center justify-center border-2 border-neo-border">
                    <Lock className="w-5 h-5 text-neo-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-neo-text-inverse">
                      {t('title')}
                    </h2>
                    <p className="font-mono text-xs text-neo-text-inverse/70">
                      {t('subtitle')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center bg-neo-text text-neo-accent hover:bg-neo-bg hover:text-neo-text border-2 border-neo-border transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="neo-email"
                    className="block font-mono text-xs font-bold uppercase tracking-wider text-neo-text"
                  >
                    {t('email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-text/40" />
                    <input
                      id="neo-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      placeholder={t('emailPlaceholder')}
                      className={cn(
                        'w-full pl-12 pr-4 py-3',
                        'bg-neo-surface border-2 border-neo-border',
                        'text-neo-text font-mono text-sm',
                        'placeholder:text-neo-text/40',
                        'focus:outline-none focus:border-neo-accent',
                        'shadow-[3px_3px_0px_0px_var(--neo-shadow)]',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="neo-password"
                    className="block font-mono text-xs font-bold uppercase tracking-wider text-neo-text"
                  >
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-text/40" />
                    <input
                      id="neo-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder={t('passwordPlaceholder')}
                      className={cn(
                        'w-full pl-12 pr-4 py-3',
                        'bg-neo-surface border-2 border-neo-border',
                        'text-neo-text font-mono text-sm',
                        'placeholder:text-neo-text/40',
                        'focus:outline-none focus:border-neo-accent',
                        'shadow-[3px_3px_0px_0px_var(--neo-shadow)]',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border-2 border-red-500 text-red-600"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-mono text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <BrutalistButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full justify-center"
                  icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                >
                  {loading ? 'Connexion...' : t('submit')}
                </BrutalistButton>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t-2 border-neo-border bg-neo-surface">
                <p className="font-mono text-xs text-neo-text/60 text-center">
                  Espace réservé aux administrateurs
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NeoLoginModal;
