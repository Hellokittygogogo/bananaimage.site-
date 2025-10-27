"use client";
import { brands, brandPricing } from "@/brands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const host = typeof window !== 'undefined' ? window.location.host.toLowerCase() : '';
  const brand = brands.find(b => b.domains.some(d => d.toLowerCase() === host)) || brands[0];
  const pricing = brandPricing[brand.id] || brandPricing.default;

  const buy = async (productId: string) => {
    try {
      const res = await fetch("/api/creem/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create checkout");
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (e:any) {
      alert(e.message || "Failed");
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {pricing.creditPacks.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{p.priceDisplay}</div>
              <p className="text-sm text-muted-foreground mb-4">{p.description || "Pay as you go credits"}</p>
              <Button className="w-full" onClick={() => buy(p.productId)}>Buy</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
