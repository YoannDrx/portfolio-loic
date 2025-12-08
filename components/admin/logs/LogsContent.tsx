"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { adminLogger } from "@/lib/logger";
import {
  ClipboardList,
  RefreshCw,
  Filter,
  Download,
  UserCircle,
  LogIn,
  LogOut,
  FilePlus,
  Pencil,
  Trash2,
  Settings,
  Key,
  Mail,
} from "lucide-react";

// ============================================
// Types
// ============================================

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface ActivityLog {
  id: string;
  type: string;
  action: string;
  userId: string | null;
  user: User | null;
  entityType: string | null;
  entityId: string | null;
  entityTitle: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface ExportLogItem {
  id: string;
  type: string;
  format: string;
  filename: string;
  fileSize: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// Helpers
// ============================================

const typeLabels: Record<string, { label: string; color: string }> = {
  auth: { label: "Authentification", color: "bg-blue-500/20 text-blue-400" },
  crud: { label: "Contenu", color: "bg-green-500/20 text-green-400" },
  export: { label: "Export", color: "bg-purple-500/20 text-purple-400" },
  settings: { label: "Paramètres", color: "bg-orange-500/20 text-orange-400" },
};

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  login: LogIn,
  logout: LogOut,
  create: FilePlus,
  update: Pencil,
  delete: Trash2,
  export: Download,
  download: Download,
  password_change: Key,
  email_change: Mail,
};

const actionLabels: Record<string, string> = {
  login: "Connexion",
  logout: "Déconnexion",
  login_failed: "Tentative échouée",
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  export: "Export",
  download: "Re-téléchargement",
  password_change: "Changement MDP",
  email_change: "Changement email",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================
// Component
// ============================================

interface LogsContentProps {
  locale: string;
}

export function LogsContent({ locale: _locale }: LogsContentProps) {
  // State pour les logs
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // State pour les exports
  const [exports, setExports] = useState<ExportLogItem[]>([]);
  const [exportsLoading, setExportsLoading] = useState(false);

  // State pour les filtres
  const [activeTab, setActiveTab] = useState<"logs" | "exports">("logs");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Fetch des logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "50",
      });
      if (typeFilter !== "all") {
        params.set("type", typeFilter);
      }

      const res = await fetch(`/api/admin/logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (error) {
      adminLogger.error("Erreur fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter]);

  // Fetch des exports
  const fetchExports = useCallback(async () => {
    setExportsLoading(true);
    try {
      const res = await fetch("/api/admin/exports");
      if (res.ok) {
        const data = await res.json();
        setExports(data.exports);
      }
    } catch (error) {
      adminLogger.error("Erreur fetch exports:", error);
    } finally {
      setExportsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    } else {
      fetchExports();
    }
  }, [activeTab, fetchLogs, fetchExports]);

  // Re-télécharger un export
  const handleDownloadExport = async (exportId: string, filename: string) => {
    try {
      const res = await fetch(`/api/admin/exports/${exportId}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      adminLogger.error("Erreur download:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-admin-text-primary dark:text-dark-admin-text-primary tracking-tight transition-colors duration-300">
            Journal d'activité
          </h1>
          <p className="text-sm sm:text-base text-admin-text-secondary dark:text-dark-admin-text-secondary mt-1 transition-colors duration-300">
            Historique de toutes les actions sur votre portfolio
          </p>
        </div>
        <button
          onClick={() => (activeTab === "logs" ? fetchLogs() : fetchExports())}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-admin-card dark:bg-dark-admin-card border border-admin-border dark:border-dark-admin-border text-admin-text-secondary dark:text-dark-admin-text-secondary hover:text-admin-text-primary dark:hover:text-dark-admin-text-primary transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-admin-border dark:border-dark-admin-border pb-2">
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === "logs"
              ? "bg-admin-accent/20 text-admin-accent border-b-2 border-admin-accent"
              : "text-admin-text-secondary dark:text-dark-admin-text-secondary hover:text-admin-text-primary dark:hover:text-dark-admin-text-primary"
          }`}
        >
          <ClipboardList className="h-5 w-5" />
          Activité
        </button>
        <button
          onClick={() => setActiveTab("exports")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === "exports"
              ? "bg-admin-accent/20 text-admin-accent border-b-2 border-admin-accent"
              : "text-admin-text-secondary dark:text-dark-admin-text-secondary hover:text-admin-text-primary dark:hover:text-dark-admin-text-primary"
          }`}
        >
          <Download className="h-5 w-5" />
          Mes exports
        </button>
      </div>

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Filtres */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-admin-text-secondary dark:text-dark-admin-text-secondary" />
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-admin-card dark:bg-dark-admin-card border border-admin-border dark:border-dark-admin-border text-admin-text-primary dark:text-dark-admin-text-primary text-sm"
              >
                <option value="all">Tous les types</option>
                <option value="auth">Authentification</option>
                <option value="crud">Contenu</option>
                <option value="export">Export</option>
                <option value="settings">Paramètres</option>
              </select>
            </div>
            {pagination && (
              <span className="text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">
                {pagination.total} enregistrement(s)
              </span>
            )}
          </div>

          {/* Table des logs */}
          <div className="bg-admin-card dark:bg-dark-admin-card rounded-xl border border-admin-border dark:border-dark-admin-border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-admin-accent" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-admin-text-secondary dark:text-dark-admin-text-secondary">
                <ClipboardList className="h-12 w-12 mb-2 opacity-50" />
                <p>Aucun log trouvé</p>
              </div>
            ) : (
              <>
                {/* Mobile: Cards view */}
                <div className="sm:hidden divide-y divide-admin-border dark:divide-dark-admin-border">
                  {logs.map((log) => {
                    const typeInfo = typeLabels[log.type] || {
                      label: log.type,
                      color: "bg-gray-500/20 text-muted-foreground",
                    };
                    const ActionIcon = actionIcons[log.action] || Settings;

                    return (
                      <div key={log.id} className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {log.user?.image ? (
                              <img src={log.user.image} alt="" className="h-6 w-6 rounded-full" />
                            ) : (
                              <UserCircle className="h-6 w-6 text-admin-text-secondary dark:text-dark-admin-text-secondary" />
                            )}
                            <span className="text-sm font-medium text-admin-text-primary dark:text-dark-admin-text-primary">
                              {log.user?.name || log.user?.email || "Système"}
                            </span>
                          </div>
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ActionIcon className="h-4 w-4 text-admin-text-secondary dark:text-dark-admin-text-secondary" />
                          <span className="text-sm text-admin-text-primary dark:text-dark-admin-text-primary">
                            {actionLabels[log.action] || log.action}
                          </span>
                        </div>
                        {log.entityTitle && (
                          <p className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary truncate">
                            {log.entityType && `[${log.entityType}] `}{log.entityTitle}
                          </p>
                        )}
                        <p className="text-[10px] text-admin-text-secondary/70 dark:text-dark-admin-text-secondary/70">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: Table view */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-admin-border dark:border-dark-admin-border bg-admin-hover/50 dark:bg-dark-admin-hover/50">
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Utilisateur
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Type
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Action
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Détails
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border dark:divide-dark-admin-border">
                      {logs.map((log) => {
                        const typeInfo = typeLabels[log.type] || {
                          label: log.type,
                          color: "bg-gray-500/20 text-muted-foreground",
                        };
                        const ActionIcon = actionIcons[log.action] || Settings;

                        return (
                          <tr
                            key={log.id}
                            className="hover:bg-admin-hover/30 dark:hover:bg-dark-admin-hover/30 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-admin-text-primary dark:text-dark-admin-text-primary whitespace-nowrap">
                              {formatDate(log.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {log.user?.image ? (
                                  <img
                                    src={log.user.image}
                                    alt=""
                                    className="h-6 w-6 rounded-full"
                                  />
                                ) : (
                                  <UserCircle className="h-6 w-6 text-admin-text-secondary dark:text-dark-admin-text-secondary" />
                                )}
                                <span className="text-sm text-admin-text-primary dark:text-dark-admin-text-primary">
                                  {log.user?.name || log.user?.email || "Système"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${typeInfo.color}`}
                              >
                                {typeInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <ActionIcon className="h-4 w-4 text-admin-text-secondary dark:text-dark-admin-text-secondary" />
                                <span className="text-sm text-admin-text-primary dark:text-dark-admin-text-primary">
                                  {actionLabels[log.action] || log.action}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary max-w-xs truncate">
                              {log.entityTitle && (
                                <span className="font-medium text-admin-text-primary dark:text-dark-admin-text-primary">
                                  {log.entityType && `[${log.entityType}] `}
                                  {log.entityTitle}
                                </span>
                              )}
                              {log.details && !log.entityTitle && (
                                <span className="opacity-75">
                                  {JSON.stringify(log.details).substring(0, 50)}...
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border dark:border-dark-admin-border">
                <span className="text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-lg bg-admin-hover dark:bg-dark-admin-hover text-admin-text-primary dark:text-dark-admin-text-primary disabled:opacity-50 transition-colors"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasMore}
                    className="px-3 py-1 rounded-lg bg-admin-hover dark:bg-dark-admin-hover text-admin-text-primary dark:text-dark-admin-text-primary disabled:opacity-50 transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Exports Tab */}
      {activeTab === "exports" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-admin-card dark:bg-dark-admin-card rounded-xl border border-admin-border dark:border-dark-admin-border overflow-hidden">
            {exportsLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-admin-accent" />
              </div>
            ) : exports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-admin-text-secondary dark:text-dark-admin-text-secondary">
                <Download className="h-12 w-12 mb-2 opacity-50" />
                <p>Aucun export trouvé</p>
                <p className="text-sm mt-1">
                  Vos exports apparaîtront ici après téléchargement
                </p>
              </div>
            ) : (
              <>
                {/* Mobile: Cards view */}
                <div className="sm:hidden divide-y divide-admin-border dark:divide-dark-admin-border">
                  {exports.map((exp) => (
                    <div key={exp.id} className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="capitalize text-sm font-medium text-admin-text-primary dark:text-dark-admin-text-primary">
                          {exp.type}
                        </span>
                        <span className="uppercase text-xs font-mono px-2 py-0.5 rounded bg-admin-hover dark:bg-dark-admin-hover text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          {exp.format}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          {formatFileSize(exp.fileSize)} • {formatDate(exp.createdAt)}
                        </span>
                        <button
                          onClick={() => handleDownloadExport(exp.id, exp.filename)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-admin-accent/20 text-admin-accent hover:bg-admin-accent/30 transition-colors text-xs"
                        >
                          <Download className="h-3 w-3" />
                          Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Table view */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-admin-border dark:border-dark-admin-border bg-admin-hover/50 dark:bg-dark-admin-hover/50">
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Type
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Format
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Taille
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border dark:divide-dark-admin-border">
                      {exports.map((exp) => (
                        <tr
                          key={exp.id}
                          className="hover:bg-admin-hover/30 dark:hover:bg-dark-admin-hover/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-admin-text-primary dark:text-dark-admin-text-primary whitespace-nowrap">
                            {formatDate(exp.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize text-sm text-admin-text-primary dark:text-dark-admin-text-primary">
                              {exp.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="uppercase text-xs font-mono px-2 py-0.5 rounded bg-admin-hover dark:bg-dark-admin-hover text-admin-text-secondary dark:text-dark-admin-text-secondary">
                              {exp.format}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary">
                            {formatFileSize(exp.fileSize)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                handleDownloadExport(exp.id, exp.filename)
                              }
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-admin-accent/20 text-admin-accent hover:bg-admin-accent/30 transition-colors text-sm"
                            >
                              <Download className="h-4 w-4" />
                              Télécharger
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
