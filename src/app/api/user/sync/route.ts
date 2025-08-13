import { auth, currentUser } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
        }

        const user = await currentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
        }

        const exsistingUser = await prisma.user.findUnique({
            where: { clerk_user_id: userId }
        })

        if (exsistingUser) {
            return NextResponse.json({
                message: 'User already exists',
                user: exsistingUser,
                alreadyExists: true,
                success: true
            })
        }

        const newUser = await prisma.user.create({
            data: {
                clerk_user_id: userId,
                email: user.emailAddresses[0]?.emailAddress || '',
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
                image_url: user.imageUrl || '',
                role_id: 1,
            }
        })

        return NextResponse.json({
            message: 'User created successfully',
            user: newUser,
            success: true
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error', success: false },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}