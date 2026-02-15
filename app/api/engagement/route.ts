import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessId, type } = body;

    if (!businessId || !type) {
      return new NextResponse('Missing Data', { status: 400 });
    }

    if (type === 'view') {
      await db.business.update({
        where: { id: businessId },
        data: { viewCount: { increment: 1 } },
      });
    } else if (type === 'contact') {
      await db.business.update({
        where: { id: businessId },
        data: { contactCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}