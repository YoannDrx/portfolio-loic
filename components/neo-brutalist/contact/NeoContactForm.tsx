"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { NeoInput } from "../ui/NeoInput";
import { NeoTextarea } from "../ui/NeoTextarea";
import { BrutalistButton } from "../ui/BrutalistButton";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface NeoContactFormProps {
  className?: string;
}

export const NeoContactForm = ({ className }: NeoContactFormProps) => {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    projectFormat: "",
    deadline: "",
    budget: "",
    references: "",
    subject: "",
    message: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          locale: document.documentElement.lang === "en" ? "en" : "fr",
        }),
      });
      if (!response.ok) throw new Error("Contact submission failed");

      toast.success(t("form.success"));
      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "",
        projectFormat: "",
        deadline: "",
        budget: "",
        references: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch {
      toast.error(t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.form
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className={cn(
        "bg-neo-surface border-2 border-neo-border p-6 md:p-8",
        "shadow-[6px_6px_0px_0px_var(--neo-shadow)]",
        className
      )}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeoInput
            label={t("form.name")}
            name="name"
            placeholder={t("form.namePlaceholder")}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <NeoInput
            label={t("form.email")}
            name="email"
            type="email"
            placeholder={t("form.emailPlaceholder")}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="hidden" aria-hidden="true">
          <NeoInput
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NeoInput
            label={t("form.company")}
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={t("form.companyPlaceholder")}
          />
          <NeoInput
            label={t("form.projectType")}
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            placeholder={t("form.projectTypePlaceholder")}
            required
          />
          <NeoInput
            label={t("form.projectFormat")}
            name="projectFormat"
            value={formData.projectFormat}
            onChange={handleChange}
            placeholder={t("form.projectFormatPlaceholder")}
          />
          <NeoInput
            label={t("form.deadline")}
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            placeholder={t("form.deadlinePlaceholder")}
          />
          <NeoInput
            label={t("form.budget")}
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder={t("form.budgetPlaceholder")}
          />
          <NeoInput
            label={t("form.references")}
            name="references"
            value={formData.references}
            onChange={handleChange}
            placeholder={t("form.referencesPlaceholder")}
          />
        </div>

        <NeoInput
          label={t("form.subject")}
          name="subject"
          placeholder={t("form.subjectPlaceholder")}
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <NeoTextarea
          label={t("form.message")}
          name="message"
          placeholder={t("form.messagePlaceholder")}
          value={formData.message}
          onChange={handleChange}
          rows={6}
          required
        />

        <BrutalistButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          icon={
            isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )
          }
          className="w-full md:w-auto"
        >
          {isSubmitting ? t("form.sending") : t("form.submit")}
        </BrutalistButton>
      </div>
    </motion.form>
  );
};

export default NeoContactForm;
