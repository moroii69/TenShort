import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = params;
  
  try {
    const linksRef = collection(db, 'links');
    const q = query(linksRef, where('shortCode', '==', shortCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      redirect('/');
    }

    const link = querySnapshot.docs[0].data();
    redirect(link.longURL);
  } catch (error) {
    console.error('Error retrieving URL:', error);
    redirect('/');
  }
}