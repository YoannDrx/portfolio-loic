"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeoCard } from "../ui/NeoCard";

interface NeoContactInfoProps {
  className?: string;
}

export const NeoContactInfo = ({ className }: NeoContactInfoProps) => {
  const t = useTranslations("contact");

  const infoItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: t("info.phone"),
      value: "+33 6 14 51 75 92",
      href: "tel:+33614517592",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "loic.ghanem@outlook.com",
      href: "mailto:loic.ghanem@outlook.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: t("info.location"),
      value: "Paris, France",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn("space-y-6", className)}
    >
      {/* Contact Info Cards */}
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <NeoCard
            key={index}
            variant="default"
            hover="lift"
            padding="md"
            className="flex items-center gap-4 hover:border-neo-accent transition-colors"
          >
            <div className="w-12 h-12 bg-neo-text text-neo-accent flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs uppercase text-neo-text/60 tracking-wider">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="font-bold text-neo-text hover:text-neo-accent transition-colors truncate block"
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-bold text-neo-text truncate">{item.value}</p>
              )}
            </div>
          </NeoCard>
        ))}
      </div>

      {/* Availability Note */}
      <div className="border-l-4 border-neo-accent pl-4 py-2">
        <p className="text-sm text-neo-text/80">{t("info.availability")}</p>
      </div>
    </motion.div>
  );
};

export default NeoContactInfo;
