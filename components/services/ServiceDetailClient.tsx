'use client';

import NeoServiceDetail from '@/components/neo-brutalist/services/NeoServiceDetail';

/* ============================================
   TYPES
   ============================================ */

interface Service {
  id: string;
  no: string;
  title: string;
  text: string;
  largeImg: string;
  largeTitle: string;
  poster: string;
  date: string;
  author: string;
  fullDescription: string;
  descriptionsFr: string;
  descriptionsEn: string;
  published: boolean;
}

interface ServiceDetailClientProps {
  service: Service;
  allServices: Service[];
  locale: string;
  isPreview?: boolean;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ServiceDetailClient({
  service,
  allServices,
  locale,
  isPreview = false,
}: ServiceDetailClientProps) {
  return (
    <NeoServiceDetail
      service={service}
      allServices={allServices}
      locale={locale}
      isPreview={isPreview}
    />
  );
}
