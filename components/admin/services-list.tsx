"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Pencil, Plus } from "lucide-react";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";

interface Service {
  id: string;
  no: string;
  largeImg: string;
  title: string;
  date: string;
  published: boolean;
}

interface ServicesListProps {
  services: Service[];
  locale: string;
}

export function ServicesList({ services, locale }: ServicesListProps) {
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez vos services proposés
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/services/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau service
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table with fixed height and scroll */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
              <TableRow>
                <TableHead>Aperçu</TableHead>
                <TableHead>N°</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    Aucun service trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell>
                      <div className="relative h-12 w-20 overflow-hidden rounded">
                        <Image
                          src={service.largeImg}
                          alt={service.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{service.no}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{service.title}</span>
                    </TableCell>
                    <TableCell>{service.date}</TableCell>
                    <TableCell>
                      {service.published ? (
                        <Badge className="bg-green-500">Publié</Badge>
                      ) : (
                        <Badge variant="secondary">Brouillon</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/${locale}/admin/services/${service.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteServiceButton
                          serviceId={service.id}
                          serviceTitle={service.title}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500">
        {filteredServices.length} résultat{filteredServices.length > 1 ? "s" : ""}
        {search && ` sur ${services.length} au total`}
      </div>
    </div>
  );
}
