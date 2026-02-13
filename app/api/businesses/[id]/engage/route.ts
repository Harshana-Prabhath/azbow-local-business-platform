import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { type } = body; 

    const updatedBusiness = await db.business.update({
      where: { id },
      data: {
        viewCount: type === 'view' ? { increment: 1 } : undefined,
        contactCount: type === 'contact' ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}