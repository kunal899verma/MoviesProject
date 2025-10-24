'use client';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background bg-[url('/bg.png')] bg-no-repeat bg-bottom bg-[length:100%_111px] bg-fixed">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin border-2 border-white/20 border-t-white rounded-full w-8 h-8 mb-4 mx-auto" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    </div>
  );
}
