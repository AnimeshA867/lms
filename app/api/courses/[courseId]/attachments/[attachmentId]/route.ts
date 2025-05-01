import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  params: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { courseId, attachmentId } = await params.params;
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!courseId || !attachmentId) {
      return new NextResponse("Course ID and Attachment ID are required", {
        status: 400,
      });
    }
    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    });
    if (userId !== courseOwner?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });
    return NextResponse.json(attachment, {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to delete attachment:", error);
    return new NextResponse("Failed to delete attachment", {
      status: 500,
    });
  }
}
