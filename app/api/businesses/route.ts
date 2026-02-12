import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, category, location, phone, email, website, description, logoUrl } = body;

    if (!name || !category || !location || !description) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const business = await db.business.create({
      data: {
        name,
        category,
        location,
        phone,
        email,
        website,
        description,
        logoUrl,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(business);
  } catch (error) {
   
    return new NextResponse('Internal Error', { status: 500 });
  }
}