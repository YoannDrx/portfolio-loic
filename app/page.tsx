export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-obsidian to-obsidian-50">
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-black text-gradient-neon">
          Loïc Ghanem
        </h1>
        <p className="mb-8 text-2xl font-light text-neon-cyan">
          Music Composer & Producer
        </p>
        <div className="glass-card-neon mx-auto max-w-2xl p-8">
          <p className="text-lg text-gray-300">
            Portfolio en cours de reconstruction avec Next.js 16, TypeScript, et Tailwind CSS.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Coming soon with a futuristic musical experience featuring Three.js 3D visualizations.
          </p>
        </div>
      </div>
    </div>
  );
}
