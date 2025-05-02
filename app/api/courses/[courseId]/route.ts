import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Mux } from "@mux/mux-node";
import { NextResponse } from "next/server";
import { MuxData } from "@prisma/client";

const client = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = await params; // No need to await params
    const { isPublished, ...data } = await req.json(); // Destructure title from the request body
    const { userId } = await auth();
    console.log(data);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }
    console.log(courseId);
    if (!data) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...data, // Update the title field
      },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!courseId) {
      return new Response("Course ID is required", { status: 400 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapter: {
          include: { muxData: true },
        },
      },
    });

    if (!ownCourse) {
      return new Response("Not found.", { status: 404 });
    }

    if (ownCourse.chapter.length > 0) {
      for (const chapter of ownCourse.chapter) {
        if (chapter.muxData?.assetId) {
          await client.video.assets.delete(chapter.muxData.assetId);
        }
      }
    }

    const deleteCourse = await db.course.delete({
      where: {
        id: courseId,
        userId,
      },
    });

    return NextResponse.json(deleteCourse, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
