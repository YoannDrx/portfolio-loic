"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const colorRef = useRef<HTMLInputElement>(null);
  const colorValue = value || "#000000";

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-12 p-0 border-2"
        style={{ backgroundColor: colorValue }}
        onClick={() => colorRef.current?.click()}
        aria-label="Choisir une couleur"
      />
      <Input
        value={colorValue}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 text-white"
      />
      <input
        ref={colorRef}
        type="color"
        value={colorValue}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />
    </div>
  );
}
