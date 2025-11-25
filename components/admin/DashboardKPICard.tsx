"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardKPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  href?: string;
  colorClass: string;
  bgColorClass: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: string;
}

export function DashboardKPICard({
  title,
  value,
  icon: Icon,
  description,
  href,
  colorClass,
  bgColorClass,
  trend,
  badge,
}: DashboardKPICardProps) {
  const cardContent = (
    <Card
      className={cn(
        "group relative overflow-hidden border border-admin-border dark:border-dark-admin-border bg-white dark:bg-dark-admin-bg-secondary hover:shadow-lg transition-all duration-300 cursor-pointer",
        href && "hover:border-admin-primary-200 dark:hover:border-admin-primary-700"
      )}
    >
      {/* Background Gradient Decoration */}
      <div
        className={cn(
          "absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300",
          bgColorClass
        )}
      />

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300",
                bgColorClass
              )}
            >
              <Icon className={cn("h-6 w-6", colorClass)} />
            </div>
            <div>
              <p className="text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300">
                {title}
              </p>
              {badge && (
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-admin-border-light"
                >
                  {badge}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">
              {value}
            </span>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-semibold",
                  trend.isPositive
                    ? "text-admin-success-600"
                    : "text-admin-danger-600"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          {description && (
            <p className="text-sm text-admin-text-tertiary dark:text-dark-admin-text-tertiary transition-colors duration-300">{description}</p>
          )}
        </div>

        {/* Hover indicator */}
        {href && (
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-admin-primary-500 to-admin-accent-500 group-hover:w-full transition-all duration-300" />
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
