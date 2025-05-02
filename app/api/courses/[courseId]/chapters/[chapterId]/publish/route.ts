import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { courseId, chapterId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!courseId || !chapterId) {
      return new NextResponse("Course ID and Chapter ID are required", {
        status: 400,
      });
    }
    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });
    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }
    if (chapter.isPublished) {
      return new NextResponse("Chapter is already published", {
        status: 400,
      });
    }
    const updatedChapter = await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(updatedChapter, {
      status: 200,
    });
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
