export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
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

      {/* Render with AI */}
      <section id="render" className="container px-4 md:px-6 py-14 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Render with AI</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <div className="bg-gray-300/80 rounded-md h-40 w-full mb-4" />
            <h3 className="text-xl font-semibold mb-2">Style Render</h3>
            <p className="text-muted-foreground">用 AI 将你的照片瞬间转化为多风格艺术图。</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="bg-gray-300/80 rounded-md h-40 w-full mb-4" />
            <h3 className="text-xl font-semibold mb-2">Photo Enhance</h3>
            <p className="text-muted-foreground">自动提升图片分辨率与细节，生成清晰 1024 px 输出。</p>
          </div>
        </div>
      </section>

      {/* Best Function */}
      <section id="features" className="container px-4 md:px-6 py-14 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Best Function</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <div className="bg-gray-300/80 rounded-md h-16 w-16" />
            <h3 className="text-lg font-semibold">One-Click Style Switch</h3>
            <p className="text-muted-foreground">一键切换多种风格（写实 / 动漫 / 胶片等），无需复杂设置。</p>
          </div>
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <div className="bg-gray-300/80 rounded-md h-16 w-16" />
            <h3 className="text-lg font-semibold">R2 Storage Direct Link</h3>
            <p className="text-muted-foreground">生成结果自动保存至 R2 存储，立即获取外链分享。</p>
          </div>
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <div className="bg-gray-300/80 rounded-md h-16 w-16" />
            <h3 className="text-lg font-semibold">Refund on Fail</h3>
            <p className="text-muted-foreground">生成失败自动返还积分／次数，无需人工申诉。</p>
          </div>
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
            <div className="bg-gray-300/80 rounded-md h-16 w-16" />
            <h3 className="text-lg font-semibold">Public Gallery Showcase</h3>
            <p className="text-muted-foreground">生成作品可选择公开加入画廊，展示你的创意作品。</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container px-4 md:px-6 py-14 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Free Plan</h3>
            <div className="bg-gray-300/60 rounded-md h-24 w-full" />
            <p className="text-muted-foreground">免费试用，每月 X 次生成，基础风格支持。</p>
            <a href="/pricing" className="mt-auto inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Get Started</a>
          </div>
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Pro Plan</h3>
            <div className="bg-gray-300/60 rounded-md h-24 w-full" />
            <p className="text-muted-foreground">解锁高清输出、批量上传、优先队列、更多风格。</p>
            <a href="/pricing" className="mt-auto inline-flex items-center rounded-md bg-yellow-400 px-4 py-2 text-black hover:brightness-95">Upgrade</a>
          </div>
          <div className="rounded-xl border bg-card p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Team / Enterprise</h3>
            <div className="bg-gray-300/60 rounded-md h-24 w-full" />
            <p className="text-muted-foreground">企业级定制，包含 API 接入、品牌授权、团队协作。</p>
            <a href="/pricing" className="mt-auto inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Footer quick links section (Policy) */}
      <section className="container px-4 md:px-6 py-12">
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="/terms" className="hover:text-primary">Terms of Service</a>
            <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
            <a href="/terms#refund" className="hover:text-primary">Refund Policy</a>
          </div>
          <p>© BananaImage 2025</p>
        </div>
      </section>
    </div>
  );
}
