import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || "your-secret-key"; 

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isOwnerRoute = pathname.startsWith('/dashboard/owner');
  const isUserRoute = pathname.startsWith('/dashboard/user');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isDashboardRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      
      const userRole = token.role as string;

      if (isOwnerRoute && userRole !== 'OWNER') {
         return NextResponse.redirect(new URL('/dashboard/user', req.url)); 
      }

      if (isUserRoute && userRole !== 'USER') {
         return NextResponse.redirect(new URL('/dashboard/owner', req.url));
      }

      return NextResponse.next();
      
    } catch (error) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (isAuthRoute && token) {
    try {
      
      const userRole = token.role as string;
      
      if (userRole === 'OWNER') {
        return NextResponse.redirect(new URL('/dashboard/owner', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/user', req.url));
      }
      
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register'
  ],
};