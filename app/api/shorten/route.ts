import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortCode;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'development') {
    const body = await request.json();
    const { url } = body;

    try {
      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
      }

      // Check if URL already exists
      const linksRef = collection(db, 'links');
      const q = query(linksRef, where('longURL', '==', url));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        return NextResponse.json({
          shortCode: existingDoc.data().shortCode,
          url: existingDoc.data().longURL
        });
      }

      // generate the new short code
      const shortCode = generateShortCode();

      // store in firestore db
      await addDoc(linksRef, {
        shortCode,
        longURL: url,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ shortCode, url });
    } catch (error) {
      console.error('Error shortening URL:', error);
      return NextResponse.json(
        { error: 'Failed to shorten URL' },
        { status: 500 }
      );
    }
  }

  // for prod build
  return new Response(null, { status: 404 });
}