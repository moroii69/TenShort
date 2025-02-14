"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function LinkCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "links"), (snapshot) => {
      setCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="text-center text-sm text-muted-foreground">
      <p className="text-base font-medium text-gray-400 mb-8">{count} links shortened so far</p>

      <p className="text-xs font-semibold uppercase text-gray-500 tracking-wide mb-2">
        Under Development
      </p>
      <p className="text-xs text-gray-400 mb-4">
        URL Redirection · Local DB Storage · Custom Short URL · PWA Support · Expiry Options · URL Validation
      </p>

      <a 
        href="https://github.com/moroii69/TenShort" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
      >
        github
      </a>
    </div>
  );
}
