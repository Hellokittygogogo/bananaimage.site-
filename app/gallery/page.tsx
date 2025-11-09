export default async function GalleryPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/gallery`, { cache: 'no-store' });
  const data = await res.json();
  const items: any[] = data.items || [];
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Public Gallery</h1>
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No public images yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.flatMap((it)=> (it.images||[]).map((src:string, i:number)=> (
            <div key={`${it.id}-${i}`} className="relative aspect-square w-full overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="image" className="w-full h-full object-cover" />
            </div>
          )))}
        </div>
      )}
    </div>
  );
}
