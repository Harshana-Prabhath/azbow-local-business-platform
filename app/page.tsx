import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user?.role === 'OWNER') {
    redirect('/dashboard/owner');
  }

  if (session.user?.role === 'USER') {
    redirect('/discover');
  }

  redirect('/login');
}