import { URLShortener } from '@/components/url-shortener';
import { LinkCounter } from '@/components/link-counter';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">TenShort URL Shortener</h1>
          <p className="text-muted-foreground">
            Shorten your links with a single click
          </p>
        </div>
        
        <URLShortener />
        <LinkCounter />
      </div>
    </div>
  );
}