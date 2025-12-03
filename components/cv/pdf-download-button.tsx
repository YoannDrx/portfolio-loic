"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { CVDocument } from "@/components/cv/pdf-document";
import type { CVData } from "@/types/cv";

interface PDFDownloadButtonProps {
  data: CVData;
  locale: string;
  iconOnly?: boolean;
}

export function PDFDownloadButton({ data, locale, iconOnly = false }: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("@react-pdf/renderer").then((mod) => {
      setPDFDownloadLink(() => mod.PDFDownloadLink);
    });
  }, []);

  if (!isClient || !PDFDownloadLink) {
    return (
      <Button size="sm" variant="outline" disabled className={iconOnly ? "border-lime-400 text-lime-400 px-2" : "border-lime-400 text-lime-400"}>
        <DownloadIcon className={iconOnly ? "h-4 w-4" : "h-4 w-4 mr-2"} />
        {!iconOnly && "..."}
      </Button>
    );
  }

  const fileName = `loic-ghanem-cv-${locale}.pdf`;

  return (
    <PDFDownloadLink
      document={<CVDocument data={data} locale={locale} />}
      fileName={fileName}
    >
      {({ loading }: { loading: boolean }) => (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          className={iconOnly ? "border-lime-400 text-lime-400 hover:bg-lime-400/10 px-2" : "border-lime-400 text-lime-400 hover:bg-lime-400/10"}
        >
          <DownloadIcon className={iconOnly ? "h-4 w-4" : "h-4 w-4 mr-2"} />
          {!iconOnly && (loading ? "..." : "Télécharger")}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
