"use client";

export const GridBackground = ({ withAccentGlow = false }: { withAccentGlow?: boolean }) => (
  <>
    {/* Grid Pattern */}
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
      style={{
        backgroundImage:
          "linear-gradient(var(--neo-border) 1px, transparent 1px), linear-gradient(90deg, var(--neo-border) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
    {/* Accent Glow (optionnel) */}
    {withAccentGlow && (
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, var(--neo-accent), transparent 70%)",
          opacity: 0.04,
        }}
      />
    )}
  </>
);

export default GridBackground;
