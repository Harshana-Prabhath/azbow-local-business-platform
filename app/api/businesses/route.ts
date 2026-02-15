import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';

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


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || 'All';
    const location = searchParams.get('location') || 'All Locations';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 6;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BusinessWhereInput = {
      AND: [
        {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        category !== 'All' ? { category } : {},
        location !== 'All Locations' ? { location: { contains: location } } : {},
      ],
    };

    const [businesses, totalCount] = await Promise.all([
      db.business.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: {
          bookmarks: userId ? { where: { userId } } : false,
        },
      }),
      db.business.count({ where: whereClause }),
    ]);

    const formattedBusinesses = businesses.map((b) => ({
      ...b,
      isBookmarked: userId ? b.bookmarks.length > 0 : false,
    }));

    return NextResponse.json({
      businesses: formattedBusinesses,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}