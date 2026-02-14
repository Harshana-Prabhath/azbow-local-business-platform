import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const business = await db.business.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!business) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}