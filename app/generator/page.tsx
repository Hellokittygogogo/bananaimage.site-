"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const STYLES = [
  { id: 'portrait', label: 'Portrait Photo', hint: 'cinematic portrait, shallow depth of field, natural light' },
  { id: 'illustration', label: 'Illustration', hint: 'clean vector illustration, flat colors, minimal shading' },
  { id: 'render3d', label: '3D Render', hint: 'octane render, soft light, realistic materials' },
  { id: 'anime', label: 'Anime', hint: 'anime style, vibrant colors, dynamic lines' },
  { id: 'cyberpunk', label: 'Cyberpunk', hint: 'neon lights, rainy streets, futuristic city' },
  { id: 'vintage', label: 'Vintage Film', hint: '35mm film, grain, warm tones, soft focus' },
];

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0].id);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!prompt.trim()) { setError('Please enter a prompt'); return; }
    setLoading(true);
    setError(null);
    setImages([]);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, count })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { window.location.href = '/sign-in'; return; }
        throw new Error(data.error || 'Failed to generate image');
      }
      setImages(data.urls || []);
    } catch (e:any) {
      setError(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">AI Image Generator</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prompt & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-28 rounded-md border border-border p-3 text-sm bg-card text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex gap-3">
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-1/2 bg-card text-foreground border-border"><SelectValue placeholder="Style" /></SelectTrigger>
                <SelectContent>
                  {STYLES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(count)} onValueChange={(v)=>setCount(Number(v))}>
                <SelectTrigger className="w-1/2 bg-card text-foreground border-border"><SelectValue placeholder="Count" /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4].map(n => <SelectItem key={n} value={String(n)}>{n} image{n>1?'s':''}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={onGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>
        <div className="space-y-4">
          {images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((src, i) => (
                    <div key={i} className="relative aspect-square w-full overflow-hidden rounded-md border">
                      <Image src={src} alt={`result-${i}`} fill className="object-contain" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-3 flex-wrap">
                  {images.map((src, i) => (
                    <a key={i} className="text-sm text-primary underline" href={src} target="_blank">Download #{i+1}</a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
