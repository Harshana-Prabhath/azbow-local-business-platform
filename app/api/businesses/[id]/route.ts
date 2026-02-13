import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'OWNER') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const {id} = await params;

    await db.business.delete({
      where: {
        id: id,
        ownerId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}