"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History, RotateCcw, Eye, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DiffViewer } from "./DiffViewer";

interface Version {
  id: string;
  version: number;
  action: "create" | "update" | "restore";
  createdBy: {
    id: string;
    email: string;
    name: string | null;
  };
  createdAt: string;
  changes: unknown[];
}

interface VersionHistoryProps {
  contentType: "album" | "video" | "service";
  contentId: string;
  trigger?: React.ReactNode;
}

export function VersionHistory({ contentType, contentId, trigger }: VersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (open) {
      fetchVersions();
    }
  }, [open]);

  async function fetchVersions() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/versions?contentType=${contentType}&contentId=${contentId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setVersions(data.versions || []);
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'historique",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(versionId: string) {
    if (!confirm("Voulez-vous vraiment restaurer cette version ?")) return;

    setRestoring(true);
    try {
      const response = await fetch("/api/admin/versions/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la restauration");

      toast({
        title: "Version restaurée ✓",
        description: "Le contenu a été restauré à cette version",
      });

      // Rafraîchir l'historique et fermer
      await fetchVersions();
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de restaurer cette version",
      });
    } finally {
      setRestoring(false);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function getActionBadge(action: string) {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      create: { variant: "default", label: "Création" },
      update: { variant: "secondary", label: "Modification" },
      restore: { variant: "outline", label: "Restauration" },
    };

    const config = variants[action] || variants.update;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        {trigger || (
          <>
            <History className="h-4 w-4" />
            Historique
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historique des versions</DialogTitle>
            <DialogDescription>
              {versions.length} version{versions.length > 1 ? "s" : ""} enregistrée
              {versions.length > 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : versions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                  <p>Aucune version enregistrée</p>
                </CardContent>
              </Card>
            ) : (
              versions.map((version, index) => {
                const isLatest = index === 0;
                const changesCount = version.changes?.length || 0;

                return (
                  <Card key={version.id} className={isLatest ? "border-primary" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              Version {version.version}
                            </span>
                            {getActionBadge(version.action)}
                            {isLatest && (
                              <Badge className="bg-green-500">Actuelle</Badge>
                            )}
                          </div>

                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>
                              Par {version.createdBy.name || version.createdBy.email}
                            </div>
                            <div>{formatDate(version.createdAt)}</div>
                            {changesCount > 0 && (
                              <div className="text-xs">
                                {changesCount} modification{changesCount > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {!isLatest && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(version.id)}
                              disabled={restoring}
                              className="gap-2"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Restaurer
                            </Button>
                          )}
                          {changesCount > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedVersion(version);
                                setShowDiff(true);
                              }}
                              className="gap-2"
                            >
                              <Eye className="h-3 w-3" />
                              Voir diff
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diff Viewer Dialog */}
      {selectedVersion && (
        <Dialog open={showDiff} onOpenChange={setShowDiff}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Modifications - Version {selectedVersion.version}
              </DialogTitle>
              <DialogDescription>
                {formatDate(selectedVersion.createdAt)} par{" "}
                {selectedVersion.createdBy.name || selectedVersion.createdBy.email}
              </DialogDescription>
            </DialogHeader>

            <DiffViewer changes={selectedVersion.changes} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
