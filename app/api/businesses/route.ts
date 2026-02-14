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


export async function GET(){
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try{
    const ownerbusinesses = await db.business.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(ownerbusinesses);
  }catch(error){
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500
    })
  }

}

