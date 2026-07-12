"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

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
  ];

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn("space-y-6", className)}
    >
      <div className="space-y-5">
        {infoItems.map((item) => (
          <motion.a
            key={item.href}
            href={item.href}
            whileHover={{ x: -6, y: -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="group relative flex min-h-36 items-end gap-5 overflow-hidden border-4 border-neo-border bg-neo-surface p-5 md:p-7 shadow-[8px_8px_0px_0px_var(--neo-shadow)] transition-colors duration-300 hover:bg-neo-text hover:shadow-[12px_12px_0px_0px_var(--neo-accent)]"
          >
            <div className="w-14 h-14 bg-neo-text text-neo-accent border-2 border-neo-border flex items-center justify-center flex-shrink-0 group-hover:bg-neo-accent group-hover:text-neo-on-accent group-hover:rotate-6 transition-all duration-300">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs uppercase text-neo-text/60 tracking-wider group-hover:text-neo-text-inverse/60">
                {item.label}
              </p>
              <p className="font-black text-base sm:text-lg md:text-xl text-neo-text group-hover:text-neo-text-inverse transition-colors break-all md:break-normal">
                {item.value}
              </p>
            </div>
            <ArrowUpRight className="h-6 w-6 shrink-0 text-neo-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </motion.a>
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
