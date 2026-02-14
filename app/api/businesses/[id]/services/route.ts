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
    const services = await db.service.findMany({
      where: { businessId: id },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, description } = body;

    if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

    const service = await db.service.create({
      data: {
        title,
        description,
        businessId: id,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { serviceId, title, description } = body;

    const updatedService = await db.service.update({
      where: { id: serviceId },
      data: { title, description },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) return new NextResponse('Missing ID', { status: 400 });

    await db.service.delete({
      where: { id: serviceId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}