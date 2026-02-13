import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const business = await db.business.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!business) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const body = await req.json();

    if (!session?.user?.id || session.user.role !== 'OWNER') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedBusiness = await db.business.update({
      where: { 
        id,
        ownerId: session.user.id 
      },
      data: {
        name: body.businessName,
        category: body.category,
        location: body.location,
        phone: body.phone,
        email: body.email,
        website: body.website,
        description: body.description,
        logoUrl: body.logoUrl,
      },
    });

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'OWNER') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    await db.business.delete({
      where: {
        id,
        ownerId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}