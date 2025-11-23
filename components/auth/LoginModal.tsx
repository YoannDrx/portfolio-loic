'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { signIn } from '@/lib/auth-client';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    } catch (err) {
      setError(t('error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-md w-full sm:max-w-md">
        <GlassCard neonColor="lime" className="w-full p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold text-white text-center tracking-tighter">
              {t('title')}
            </DialogTitle>
            <p className="text-gray-400 text-center mt-2">
              {t('subtitle')}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-neon-lime"
                placeholder={t('emailPlaceholder')}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-neon-lime"
                placeholder={t('passwordPlaceholder')}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="pt-2">
              <NeonButton
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center"
                color="lime"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('submit')}
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      </DialogContent>
    </Dialog>
  );
}
