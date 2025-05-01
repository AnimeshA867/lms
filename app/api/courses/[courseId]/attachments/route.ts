import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    const { url, name } = await req.json();

    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });

    if (userId !== courseOwner?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name,
        courseId: courseId,
      },
    });
    return NextResponse.json(attachment, {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create attachment:", error);
    return new NextResponse("Failed to create attachment", {
      status: 500,
    });
  }
}
