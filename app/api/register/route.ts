import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { error } from "console";

export async function POST(request: Request) {
    try{
        const {email,password, role} = await request.json();

        if(!email || !password || !role) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if(existingUser){
            return NextResponse.json({error:"User already exists"}, {status: 400});
        }

        if(password.length < 8){
            return NextResponse.json({error: "Password must be at least 8 characters long"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data:{
                email,password: hashedPassword, role
            }
        })
        return NextResponse.json({message: "User registered successfully"}, {status: 201});

    }catch(error){
        return NextResponse.json({error: "User registration failed"}, {status: 500});
    }
}