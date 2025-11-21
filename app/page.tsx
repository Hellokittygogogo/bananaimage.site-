import dynamic from "next/dynamic";\nconst InlineGenerator = dynamic(() => import("@/components/inline-generator"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero (kept) */}
      <section className="container px-4 md:px-6 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              BananaImage — AI Image Render for Everyone
            </h1>
            <p className="text-muted-foreground text-lg">
              上传你的图片，选择风格，一键生成 1024 px 高清新图
            </p>
            <div className="flex gap-3">
              <a href="/generator" className="inline-flex items-center rounded-md bg-yellow-400 px-5 py-3 font-medium text-black shadow hover:brightness-95">
                Try Generator
              </a>
            </div>
          </div>
          <div className="w-full">
            <div className="bg-gray-300/70 rounded-xl h-64 md:h-80 w-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container px-4 md:px-6 py-14 md:py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Features</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <div className="bg-gray-300 rounded-xl h-40 w-full mb-4" />
            <h3 className="text-xl font-semibold mb-1">Style Render</h3>
            <p className="text-muted-foreground">Transform your photo into multiple artistic styles with a single prompt.</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="bg-gray-300 rounded-xl h-40 w-full mb-4" />
            <h3 className="text-xl font-semibold mb-1">Photo Enhance</h3>
            <p className="text-muted-foreground">Automatically enhance clarity and generate a sharp 1024px output.</p>
          </div>
        </div>
      </section>

      {/* Why BananaImage */}
      <section id="why" className="container px-4 md:px-6 py-14 md:py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Why BananaImage</h2>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <h3 className="text-base font-semibold">One-Click Style Switch</h3>
            <p className="text-sm text-muted-foreground">Quickly switch between realistic, anime, and other creative styles.</p>
          </div>
          <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <h3 className="text-base font-semibold">Consistent Results</h3>
            <p className="text-sm text-muted-foreground">Designed for stable, repeatable edits instead of random generations.</p>
          </div>
          <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <h3 className="text-base font-semibold">Safe Credit Usage</h3>
            <p className="text-sm text-muted-foreground">Only charge for successful generations (or use a neutral policy).</p>
          </div>
          <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <h3 className="text-base font-semibold">Fast and Simple</h3>
            <p className="text-sm text-muted-foreground">Minimal UI, just upload, describe, and render.</p>
          </div>
        </div>
      </section>

      {/* Pricing (placeholder) */}
      <section id="pricing" className="container px-4 md:px-6 py-14 md:py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Pricing</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-muted-foreground">Try BananaImage with a limited number of free generations.</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Basic styles</li>
              <li>Limited monthly renders</li>
              <li>Community support</li>
            </ul>
            <a href="/pricing" className="mt-auto inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Get Started</a>
          </div>
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-muted-foreground">For regular creators who need more credits and faster generation.</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>More credits</li>
              <li>HD output</li>
              <li>Priority queue</li>
            </ul>
            <a href="/pricing" className="mt-auto inline-flex items-center rounded-md bg-yellow-400 px-4 py-2 text-black hover:brightness-95">Upgrade</a>
          </div>
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <h3 className="text-xl font-semibold">Team</h3>
            <p className="text-muted-foreground">For teams and businesses that need higher limits and API access.</p>
            <div className="text-xs text-muted-foreground">Coming soon</div>
            <a href="/pricing" className="mt-auto inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Contact</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container px-4 md:px-6 py-10 text-center text-sm text-muted-foreground">
          <div className="flex gap-6 justify-center mb-3 flex-wrap">
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Refund</a>
          </div>
          <p>© BananaImage 2025</p>
        </div>
      </footer>
    </div>
  );
}
