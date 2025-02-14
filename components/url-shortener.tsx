"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    for (let i = 0; i < 6; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortCode;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        throw new Error('Invalid URL');
      }

      // Check if URL already exists
      const linksRef = collection(db, 'links');
      const q = query(linksRef, where('longURL', '==', url));
      const querySnapshot = await getDocs(q);

      let shortCode;

      if (!querySnapshot.empty) {
        shortCode = querySnapshot.docs[0].data().shortCode;
      } else {
        // Generate new short code
        shortCode = generateShortCode();

        // Store in Firestore
        await addDoc(linksRef, {
          shortCode,
          longURL: url,
          createdAt: new Date().toISOString()
        });
      }

      const shortenedUrl = `${window.location.origin}/${shortCode}`;
      setShortUrl(shortenedUrl);
      toast({
        title: "URL Shortened",
        description: "Your shortened URL is ready to use!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter your URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Shortening..." : "Shorten"}
          </Button>
        </div>
      </form>

      {shortUrl && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <Input
              value={shortUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}