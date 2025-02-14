import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

type Params = Promise<{ shortCode: string }>;

export default async function RedirectPage({ params }: { params: Params }) {
  const resolvedParams = await params; // Await the params
  const { shortCode } = resolvedParams;

  try {
    const linksRef = collection(db, 'links');
    const q = query(linksRef, where('shortCode', '==', shortCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return redirect('/');
    }

    const link = querySnapshot.docs[0].data();
    return redirect(link.longURL);
  } catch (error) {
    console.error('Error retrieving URL:', error);
    return redirect('/');
  }
}
