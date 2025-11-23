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
          <h1 className="text-3xl font-bold tracking-tight text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Services</h1>
          <p className="text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300">
            Gérez vos services proposés ({services.length} au total)
          </p>
        </div>
        <Button
          asChild
          className="gap-2 bg-gradient-to-r from-admin-primary-500 to-admin-accent-500 hover:from-admin-primary-600 hover:to-admin-accent-600 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Link href={`/${locale}/admin/services/new`}>
            <Plus className="h-4 w-4" />
            Nouveau service
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-text-tertiary dark:text-dark-admin-text-tertiary transition-colors duration-300" />
          <Input
            placeholder="Rechercher un service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table with fixed height and scroll */}
      <div className="rounded-lg border border-admin-border dark:border-dark-admin-border bg-white dark:bg-dark-admin-bg-secondary shadow-sm overflow-hidden transition-colors duration-300">
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-admin-bg-secondary dark:bg-dark-admin-bg-tertiary z-10 border-b border-admin-border dark:border-dark-admin-border transition-colors duration-300">
              <TableRow className="hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary">
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Aperçu</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">N°</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Titre</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Date</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Statut</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300"
                  >
                    Aucun service trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="group hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary transition-colors duration-150 border-b border-admin-border-light dark:border-dark-admin-border-light last:border-b-0"
                  >
                    <TableCell>
                      <div className="relative h-14 w-24 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        <Image
                          src={service.largeImg}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-neon-cyan/30 dark:border-cyan-400/30 bg-cyan-50 dark:bg-cyan-900/20 text-neon-cyan dark:text-cyan-400 font-bold transition-colors duration-300"
                      >
                        #{service.no}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">{service.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-admin-text-secondary dark:text-dark-admin-text-secondary text-sm transition-colors duration-300">{service.date}</span>
                    </TableCell>
                    <TableCell>
                      {service.published ? (
                        <Badge className="bg-admin-success-500 dark:bg-admin-success-600 hover:bg-admin-success-600 dark:hover:bg-admin-success-700 text-white font-medium shadow-sm transition-colors duration-300">
                          Publié
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700 font-medium transition-colors duration-300"
                        >
                          Brouillon
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-9 w-9 p-0 hover:bg-admin-accent-50 dark:hover:bg-admin-accent-900/20 hover:text-admin-accent-600 dark:hover:text-admin-accent-400 transition-all duration-200"
                        >
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
      <div className="text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300">
        {filteredServices.length} résultat{filteredServices.length > 1 ? "s" : ""}
        {search && ` sur ${services.length} au total`}
      </div>
    </div>
  );
}
