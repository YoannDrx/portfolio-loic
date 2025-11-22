export default function AlbumDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian via-obsidian-50 to-obsidian py-20">
      <div className="container-custom">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Album Cover Skeleton */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden sticky top-24">
              <div className="relative aspect-square w-full bg-white/10 animate-pulse" />
              <div className="p-6">
                <div className="h-12 w-full bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Album Details Skeleton */}
          <div className="lg:col-span-3 space-y-8">
            {/* Title & Meta Skeleton */}
            <div className="glass-card p-8">
              <div className="h-12 w-3/4 bg-white/10 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                <div className="h-6 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-6 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-6 w-2/3 bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="glass-card p-8">
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-6" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
