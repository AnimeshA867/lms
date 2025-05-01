"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ChapterList from "./ChapterList";

interface ChapterFormProps {
  initialData: Course & { chapter: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => {
    if (isCreating) {
      form.reset();
    }
    setIsCreating((prev) => !prev);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, data);
      toast.success("Chapter Created");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Failed to create chapter");
      console.error("Failed to create course title:", error);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = async (chapterId: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-slate-100 opacity-50 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button variant={"ghost"} onClick={toggleCreating}>
          {isCreating ? <>Cancel</> : <PlusCircle className="h-4 w-4" />}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={2}
                      className="resize-none"
                      placeholder="e.g. 'This course covers advanced topics...'"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2 ",
            !initialData.chapter.length && "text-muted-foreground italic"
          )}
        >
          {" "}
          {!initialData.chapter.length && "No Chapters"}{" "}
          {/* Todo: Add a list of chapters */}
          <ChapterList
            key={initialData.chapter.length}
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapter || {}}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drap and drop to reorder the chapters.
        </p>
      )}
    </div>
  );
};

export default ChapterForm;
