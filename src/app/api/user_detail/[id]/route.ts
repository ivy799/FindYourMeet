import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("User_detail creation request body:", body);

    const { user_id, address } = body;

    if (!user_id || !address) {
      return NextResponse.json(
        { error: "user_id and address are required" },
        { status: 400 }
      );
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );

    if (!geoRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch geolocation data" },
        { status: 500 }
      );
    }

    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const latFix = parseFloat(geoData[0].lat);
    const lonFix = parseFloat(geoData[0].lon);

    if (isNaN(latFix) || isNaN(lonFix)) {
      return NextResponse.json(
        { error: "Invalid coordinates received" },
        { status: 500 }
      );
    }

    const newUserDetail = await prisma.user_detail.create({
      data: {
        user_id: user_id,
        address: address,
        lat: latFix.toString(),
        long: lonFix.toString(),
      },
    });

    return NextResponse.json(newUserDetail, { status: 201 });
  } catch (error) {
    console.error("Error creating user detail:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId }
    });

    const userDetail = await prisma.user_detail.findFirst({
      where: { user_id: user?.id }
    })

    return NextResponse.json(userDetail)

  } catch (error) {
    console.error("Error finding room:", error);
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json(); 
    const { newAddress } = body;

    if (!newAddress) {
      return NextResponse.json({ error: "newAddress is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newAddress)}`
    );

    if (!geoRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch geolocation data" },
        { status: 500 }
      );
    }

    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const latFix = parseFloat(geoData[0].lat);
    const lonFix = parseFloat(geoData[0].lon);

    if (isNaN(latFix) || isNaN(lonFix)) {
      return NextResponse.json(
        { error: "Invalid coordinates received" },
        { status: 500 }
      );
    }

    const updateAddress = await prisma.user_detail.update({
      where: {
        id: parseInt(id)
      },
      data: {
        address: newAddress,
        lat: latFix.toString(),
        long: lonFix.toString()
      }
    });

    return NextResponse.json(updateAddress, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to update address",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}

