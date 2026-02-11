import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" as const},
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email"},
        password: { label: "Password", type: "password" },
      },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          
          if(!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error("Invalid email or password");
          }
          
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        },
    }),
  ],
  callbacks: {
    async jwt({token,user}: any){
        if (user) token.role = user.role;
        return token;
    },
    async session({session,token}:any){
        if(session.user) session.user.role = token.role;
        return session;
    },
    pages:{
        signIn:'/login',
    }
    },

  
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };