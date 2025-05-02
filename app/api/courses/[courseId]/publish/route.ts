import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapter: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    if (
      !course.title ||
      !course.description ||
      !course.categoryId ||
      !course.price ||
      !course.imageUrl ||
      !course.chapter.some((chapter) => chapter.isPublished)
    ) {
      return new NextResponse("Course is not ready to be published", {
        status: 400,
      });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.log("Failed to update course", error);
    return new NextResponse("Failed to update course", { status: 500 });
  }
}
