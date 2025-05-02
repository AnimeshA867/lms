import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListCheck,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChapterForm from "./_components/ChapterForm";
import { CourseAction } from "./_components/CourseAction";
import Banner from "@/components/banner";
import { Label } from "@/components/ui/label";
import React from "react";
const Page = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = await params;

  const course = await db.course.findFirst({
    where: {
      id: courseId,
    },
    include: {
      chapter: {
        orderBy: {
          createdAt: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const category = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const { userId } = await auth();

  if (course.userId !== userId) {
    return <div>Unauthorized</div>;
  }
  // const { userId } = await auth();

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapter.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields}`;
  return (
    <>
      {!course?.isPublished && (
        <Banner
          label="This course is not published yet. Click on publish to publish it."
          variant={"warning"}
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <CourseAction
            disabled={completedFields !== totalFields}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-2  mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={courseId} />
            <CategoryForm
              initialData={course}
              courseId={courseId}
              options={category.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </div>
          <div className="space-y-6 ">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListCheck} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2 overflow-x-hidden">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
