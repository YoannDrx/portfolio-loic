"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoId,
  title = 'Video'
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const t = useTranslations('common');

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleFullscreen = () => {
    if (iframeRef.current?.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-neo-text/90 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-neo-bg border-4 border-neo-border shadow-[8px_8px_0px_0px_var(--neo-accent)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-4 border-neo-border">
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-neo-text">
                {title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleFullscreen}
                  className="p-2 border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent transition-colors"
                  aria-label={t('fullscreen') || 'Fullscreen'}
                >
                  <Maximize2 size={16} />
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent transition-colors"
                  aria-label="Open on YouTube"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 border-2 border-neo-border hover:bg-neo-text hover:text-neo-text-inverse hover:border-neo-text transition-colors"
                  aria-label={t('close') || 'Close'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Video */}
            <div className="aspect-video bg-neo-text">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                title={title}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
