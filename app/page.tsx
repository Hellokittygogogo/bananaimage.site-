"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-6">
            <Image src="/logo.svg" width={80} height={80} alt="Banana image" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Banana image
              <span className="block text-primary">Edit images with text</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Simple, consistent AI image editing. Upload an image and describe your change – we handle the rest.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/generator">Try the editor</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
