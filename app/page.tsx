import { URLShortener } from "@/components/url-shortener";
import { LinkCounter } from "@/components/link-counter";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-3/4 bg-gradient-radial from-gray-700 via-black to-black opacity-40 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-lg space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-gray-300">TenShort</span> URL Shortener
        </h1>
        <p className="text-muted-foreground">Shorten your links with a single click</p>

        <URLShortener />
        <LinkCounter />
      </div>
    </div>
  );
}
