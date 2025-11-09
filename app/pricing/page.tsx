"use client";
import { brands, brandPricing } from "@/brands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const host = typeof window !== 'undefined' ? window.location.host.toLowerCase() : '';
  const brand = brands.find(b => b.domains.some(d => d.toLowerCase() === host)) || brands[0];
  const pricing = brandPricing[brand.id] || brandPricing.default;

  const buy = async (productId: string, productType?: 'subscription'|'credits', credits?: number) => {
    try {
      const res = await fetch('/api/creem/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, productType: productType || 'credits', credits: credits || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (e:any) {
      alert(e.message || 'Failed');
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>

      {pricing.subscriptions && pricing.subscriptions.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Subscriptions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.subscriptions.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{p.priceDisplay}</div>
                  <p className="text-sm text-muted-foreground mb-4">{p.description || 'Monthly credits'}</p>
                  <Button className="w-full" onClick={() => buy(p.productId, 'subscription')}>Subscribe</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-3">Credit Packs</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {pricing.creditPacks.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{p.priceDisplay}</div>
              <p className="text-sm text-muted-foreground mb-4">{p.description || 'Pay as you go credits'}</p>
              <Button className="w-full" onClick={() => buy(p.productId, 'credits', p.credits)}>Buy</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-6">Taxes calculated at checkout.</p>
    </div>
  );
}
