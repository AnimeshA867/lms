"use client";

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Trash } from "lucide-react";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import ConfirmModal from "@/components/confirm-model";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseActionProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const CourseAction = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionProps) => {
  const confetti = useConfettiStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Courses deleted successfully");
      router.push("/teacher/courses/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async () => {
    setIsLoading(true);
    try {
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished successfully");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published successfully");
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={disabled}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={() => {
          onDelete();
        }}
        title="Are you sure you want to delete this course?"
        description="This action cannot be undone. This will permanently delete the course and all its content."
      >
        <Button disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
