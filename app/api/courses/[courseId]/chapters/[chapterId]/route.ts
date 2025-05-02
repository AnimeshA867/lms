import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// Initialize Mux client with environment variables
const client = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    // Authenticate the user and extract the user ID.
    const { userId } = await auth();

    // Destructure courseId and chapterId from parameters.
    const { courseId, chapterId } = await params;

    // If there's no authenticated user, return Unauthorized.
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify that the authenticated user owns the course.
    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request body and separate out any fields not needed.
    // 'isPublished' is removed, and the rest of the data is stored in 'data'.
    const { isPublished, ...data } = await req.json();
    console.log(data);

    // Check if any data is provided; if not, return an error.
    if (!data) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Update the chapter with the provided data.
    const chapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { ...data },
    });

    // If a video URL is provided in the data, handle the Mux asset update.
    if (data.videoUrl) {
      // Check if there is an existing Mux asset associated with this chapter.
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: chapterId },
      });

      // If an existing asset is found, delete it from Mux and remove the record from the DB.
      if (existingMuxData) {
        await client.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: { id: existingMuxData.id },
        });
      }

      // Destructure videoUrl from data (videoUrl should be present here).
      const { videoUrl } = data;
      // Create a new asset using the Mux client.
      const asset = await client.video.assets.create({
        inputs: [{ url: videoUrl }],
        playback_policies: ["public"],
        test: false,
      });
      console.log("Asset created:", asset);

      // Verify that a playback ID was created; if not, return an error.
      if (!asset.playback_ids?.[0].id) {
        return new NextResponse("Playback ID not found", { status: 500 });
      }

      // Save the new Mux asset data into the database.
      await db.muxData.create({
        data: {
          chapterId: chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    // Return the updated chapter as a JSON response.
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("Failed to update chapter title.", error);
    return new NextResponse("Failed to update chapter video", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!courseId || !chapterId) {
      return new NextResponse("Course ID and Chapter ID are required", {
        status: 400,
      });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!ownCourse) {
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
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingMuxData) {
        await client.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      orderBy: {
        position: "asc",
      },
    });
    if (publishedChaptersInCourse.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    // Reorder the remaining chapters
    const chapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "asc",
      },
    });
    const updateOperations = chapters.map((chapter, index) => {
      return db.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      });
    });
    await Promise.all(updateOperations);
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });
    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("Failed to delete chapter", error);
    return new NextResponse("Failed to delete chapter", { status: 500 });
  }
}
