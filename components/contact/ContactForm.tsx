'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        'service_dx7j65t',
        'template_653oqpu',
        form.current,
        'W4SjcLIIqIH2c8aZX'
      );

      // Créer une notification admin (non-bloquant)
      const formData = new FormData(form.current);
      fetch('/api/contact/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('user_email'),
        }),
      }).catch(() => {}); // Ignorer les erreurs

      toast.success(t('success'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });

      form.current.reset();
    } catch {
      toast.error(t('error'), {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard variant="neon" className="w-full">
      <GlassCardContent className="p-8">
        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          {/* Name Input */}
          <div className="relative group">
            <label htmlFor="name" className="block text-sm font-semibold text-neon-cyan mb-2">
              {t('name')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neon-cyan transition-colors" />
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full pl-12 pr-4 py-3 bg-obsidian-100/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                placeholder={t('namePlaceholder')}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="relative group">
            <label htmlFor="email" className="block text-sm font-semibold text-neon-cyan mb-2">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neon-cyan transition-colors" />
              <input
                type="email"
                id="email"
                name="user_email"
                required
                className="w-full pl-12 pr-4 py-3 bg-obsidian-100/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          {/* Message Textarea */}
          <div className="relative group">
            <label htmlFor="message" className="block text-sm font-semibold text-neon-cyan mb-2">
              {t('message')}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-neon-cyan transition-colors" />
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full pl-12 pr-4 py-3 bg-obsidian-100/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all resize-none"
                placeholder={t('messagePlaceholder')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('sending')}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{t('submit')}</span>
              </>
            )}
          </button>
        </form>
      </GlassCardContent>
    </GlassCard>
  );
}