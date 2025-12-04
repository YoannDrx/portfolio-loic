"use client";

import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 bg-neo-border/50 animate-pulse",
        className
      )}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="border-2 border-neo-border bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)] overflow-hidden">
      <table className="w-full">
        <thead className="bg-neo-surface border-b-2 border-neo-border">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <SkeletonBar className="w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "border-b border-neo-border/50",
                rowIndex % 2 === 0 ? "bg-neo-bg" : "bg-neo-bg-alt/30"
              )}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <SkeletonBar className={colIndex === 0 ? "w-20 h-10" : "w-full"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
