"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src, alt, title }) => {
  const t = useTranslations("common");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

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
          <div className="absolute inset-0 bg-neo-text/90 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-neo-bg border-4 border-neo-border shadow-[8px_8px_0px_0px_var(--neo-accent)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-4 border-neo-border">
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-neo-text">
                {title ?? alt}
              </h3>
              <button
                onClick={onClose}
                className="p-2 border-2 border-neo-border hover:bg-neo-text hover:text-neo-text-inverse hover:border-neo-text transition-colors"
                aria-label={t("close") || "Close"}
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative w-full h-[70vh] bg-neo-text/5">
              <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" priority />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
