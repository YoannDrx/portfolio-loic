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
import { ExportButton } from "@/components/admin/ExportButton";

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
          <h1 className="text-3xl font-black text-white mb-2 font-montserrat tracking-tight">
            Services Library
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Manage your services / {services.length} total entries
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton type="services" />
          <Button
            asChild
            className="gap-2 bg-gradient-to-r from-[var(--admin-neon-purple)] to-[var(--admin-neon-cyan)] text-white font-bold hover:shadow-[0_0_20px_rgba(161,0,242,0.4)] transition-all border-none"
          >
            <Link href={`/${locale}/admin/services/new`}>
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white focus:border-[var(--admin-neon-purple)]/50 focus:ring-[var(--admin-neon-purple)]/20"
          />
        </div>
      </div>

      {/* Table with fixed height and scroll */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-colors duration-300">
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-[var(--glass-subtle)] backdrop-blur-md z-10 border-b border-[var(--glass-border)] transition-colors duration-300">
              <TableRow className="hover:bg-[var(--glass-subtle)] border-[var(--glass-border)]">
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Aperçu</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">N°</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Titre</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Date</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Statut</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="group hover:bg-[var(--glass-subtle)] transition-colors duration-150 border-b border-[var(--glass-border-subtle)] last:border-b-0"
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
                        className="border-[var(--admin-neon-cyan)]/30 bg-[var(--admin-neon-cyan)]/10 text-[var(--admin-neon-cyan)] font-bold"
                      >
                        #{service.no}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-white">{service.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm font-mono">{service.date}</span>
                    </TableCell>
                    <TableCell>
                      {service.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-neon-green/10 text-neon-green border border-neon-green/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-[var(--glass-subtle)] text-muted-foreground border border-[var(--glass-border)]">
                          Draft
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-[var(--admin-neon-lime)] hover:bg-[var(--admin-neon-lime)]/10 transition-all duration-200"
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
      <div className="text-sm text-muted-foreground font-mono">
        {filteredServices.length} result{filteredServices.length > 1 ? "s" : ""}
        {search && ` of ${services.length} total`}
      </div>
    </div>
  );
}
