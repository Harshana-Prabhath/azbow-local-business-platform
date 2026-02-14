import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

    const { businessId } = await req.json();
    const userId = session.user.id;

    const existingBookmark = await db.bookmark.findFirst({
      where: { userId, businessId },
    });

    if (existingBookmark) {
      await db.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      await db.bookmark.create({
        data: { userId, businessId },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

    const bookmarks = await db.bookmark.findMany({
      where: { userId: session.user.id },
      include: { business: true },
    });

    return NextResponse.json(bookmarks.map(b => ({ ...b.business, isBookmarked: true })));
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}