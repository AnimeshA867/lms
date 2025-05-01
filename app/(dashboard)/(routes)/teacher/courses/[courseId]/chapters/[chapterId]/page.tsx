import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Eye, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideo from "./_components/ChapterVideo";

const ChapterIdPage = async ({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) => {
  const { userId } = await auth();
  const { chapterId, courseId } = await params;

  if (!userId) {
    return redirect("/sign-in");
  }
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect(`/teacher/courses/${courseId}`);
  }

  const requiredFields = [
    chapter?.title,
    chapter?.description,
    chapter?.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((field) => field).length;
  const completedText = ` (${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition-all mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course Setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2 ">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-muted-foreground">
                Complete all fields {completedText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4 ">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
          </div>
          <ChapterTitleForm
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
          <ChapterDescriptionForm
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Setting</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">Add a video</h2>
          </div>
          <ChapterVideo
            initialData={chapter}
            chapterId={chapterId}
            courseId={courseId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
