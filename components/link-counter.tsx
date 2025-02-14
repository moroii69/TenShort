"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export function LinkCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'links'), (snapshot) => {
      setCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="text-center text-sm text-muted-foreground">
      {count} links shortened so far
    </div>
  );
}