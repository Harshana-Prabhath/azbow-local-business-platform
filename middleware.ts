import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
   const token = req.nextauth.token;
   const pathName = req.nextUrl.pathname;

   if (pathName.startsWith("/owner") && token?.role !== "OWNER") {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  if (pathName.startsWith("/user") && token?.role !== "USER") {
    return NextResponse.redirect(new URL("/owner/dashboard", req.url));
  }
},{
    callbacks: {
        authorized: ({ token }) => !!token,
    }
});


export const config = {
  matcher: ["/owner/:path*", "/user/:path*","/settings/:path*"],
};
