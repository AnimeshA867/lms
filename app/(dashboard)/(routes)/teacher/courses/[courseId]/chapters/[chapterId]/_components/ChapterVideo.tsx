"use client";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import MuxPlayer from "@mux/mux-player-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { Pencil, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterVideoProps {
  initialData: Chapter & { muxData: MuxData | null };
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "Video URL is required",
  }),
});

const ChapterVideo = ({
  initialData,
  chapterId,
  courseId,
}: ChapterVideoProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    if (isEditting) {
      form.reset(); // Reset form to initial values
    }
    setIsEditting((prev) => !prev);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
      toast.success("Chapter Video updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update chapter Video");
      console.error("Failed to update chapter video:", error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? <>Cancel</> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {isEditting && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url.url) {
                onSubmit({ videoUrl: url.url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video.
          </div>
        </div>
      )}
      {!isEditting &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData.muxData?.playbackId || ""}
              /* streamType="on-demand"
            autoPlay={false}
            className="rounded-md" */
            />
          </div>
        ))}
      {!isEditting && !initialData.muxData && (
        <div className="text-sm text-muted-foreground italic mt-2">
          This chapter does not have a video yet.
        </div>
      )}
    </div>
  );
};

export default ChapterVideo;
