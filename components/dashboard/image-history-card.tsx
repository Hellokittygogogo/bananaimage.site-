"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Log = { id: string; created_at: string; prompt?: string; style?: string; count?: number; images?: string[]; public?: boolean };

export function ImageHistoryCard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch('/api/image/history');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      // noop
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const togglePublic = async (id: string, next: boolean) => {
    const res = await fetch('/api/image/public', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ id, public: next }) });
    if (res.ok) load();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Generations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No generations yet.</div>
        ) : (
          <div className="space-y-6">
            {logs.slice(0,5).map((log)=> (
              <div key={log.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <div className="text-muted-foreground">{new Date(log.created_at).toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{log.public ? 'Public' : 'Private'}</span>
                    <Button variant="outline" size="sm" onClick={()=>togglePublic(log.id, !log.public!)}>{log.public ? 'Make private' : 'Make public'}</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(log.images||[]).slice(0,4).map((src,i)=> (
                    <div key={i} className="relative aspect-square w-full overflow-hidden rounded">
                      <Image src={src} alt={`g-${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                {log.prompt && (
                  <div className="mt-2 text-xs text-muted-foreground line-clamp-2">{log.prompt}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
