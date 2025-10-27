"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = new FormData();
      if (file) body.append("image", file);
      body.append("prompt", prompt);
      const res = await fetch("/api/image/edit", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to edit image");
      setResult(data.url || null);
    } catch (e:any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">AI Image Editor</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload & Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="file" accept="image/*" onChange={onFile} />
            <textarea
              placeholder="Describe how to edit the image..."
              className="w-full min-h-28 rounded-md border p-3 text-sm bg-background"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={onGenerate} disabled={loading}>
              {loading ? "Processing..." : "Generate"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>
        <div className="space-y-4">
          {preview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                  <Image src={preview} alt="preview" fill className="object-contain" />
                </div>
              </CardContent>
            </Card>
          )}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                  <Image src={result} alt="result" fill className="object-contain" />
                </div>
                <div className="mt-3">
                  <a className="text-sm text-primary underline" href={result} target="_blank">Open image</a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
