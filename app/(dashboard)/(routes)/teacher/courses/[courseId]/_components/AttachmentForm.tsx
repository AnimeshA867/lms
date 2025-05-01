"use client";
import FileUpload from "@/components/FileUpload";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { Attachment, Course } from "@prisma/client";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import axios from "axios";
import { Loader, Paperclip, PlusCircle, Trash, X, File } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  attachments: z.object({
    name: z.string().optional(),
    url: z.string().optional(),
  }),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachments: { name: "", url: "" },
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    if (isEditting) {
      form.reset();
    }
    setIsEditting((prev) => !prev);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { attachments } = data;
      await axios.post(`/api/courses/${courseId}/attachments`, attachments);
      toast.success("Attachment uploaded successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Failed to upload attachment");
      console.error("Failed to upload attachment:", error);
    }
  };

  const onDeleteAttachment = async (attachmentId: string) => {
    console.log("this is working.");
    setIsDeleting(true);
    try {
      await axios.delete(
        `/api/courses/${courseId}/attachments/${attachmentId}`
      );
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete attachment");
      console.error("Failed to delete attachment:", error);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 min-h-[100px]">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? (
            <>
              <X /> Cancel
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" /> Add Attachment
            </>
          )}
        </Button>
      </div>
      {!isEditting &&
      (!initialData.attachments || initialData.attachments.length === 0) ? (
        <div className="flex items-center justify-center h-20 bg-slate-200 rounded-md min-h-[100px]">
          <p className="text-sm text-slate-500 p-2">
            No attachments uploaded yet. Click "Add Attachment" to upload one.
          </p>
        </div>
      ) : (
        initialData.attachments &&
        initialData.attachments.length > 0 && (
          <ul className="mt-2 space-y-4 overflow-x-hidden">
            {initialData.attachments.map((att) => (
              /*    <li key={att.id} className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-slate-500" />
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  {att.name}
                </a>
                <div className="ml-auto">
                  <AlertDialog
                    open={deleting === att.id}
                    onOpenChange={(open) => !open && setDeleting("")}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={isDeleting && deleting === att.id}
                        variant="destructive"
                        size={"sm"}
                        onClick={() => setDeleting(att.id)}
                      >
                        {isDeleting && deleting === att.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full border-slate-500" />
                        ) : (
                          <Trash />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this attachment?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the attachment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setDeleting("")}
                          disabled={isDeleting && deleting === att.id}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            setIsDeleting(true);
                            try {
                              await axios.delete(
                                `/api/courses/${courseId}/attachments/${att.id}`
                              );
                              toast.success("Attachment deleted successfully");
                              router.refresh();
                            } catch (error) {
                              toast.error("Failed to delete attachment");
                              console.error(
                                "Failed to delete attachment:",
                                error
                              );
                            } finally {
                              setIsDeleting(false);
                              setDeleting("");
                            }
                          }}
                          disabled={isDeleting && deleting === att.id}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li> */
              <div
                key={att.id}
                className="flex items-center  w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md relative "
              >
                <div className="flex items-center w-full gap-2 relative p-2">
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{att.name}</p>
                  {deletingId === att.id ? (
                    <div className="h-8 ">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <Button
                      className="ml-auto hover:opacity-75 transition cursor-pointer"
                      onClick={() => {
                        setDeletingId(att.id);
                      }}
                      variant={"ghost"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div
                  className={cn(
                    "absolute top-0 -right-[101%] w-full h-full flex items-center justify-center bg-sky-100 rounded-md gap-4 shadow-md transition-all duration-300 border-sky-400 border",
                    deletingId === att.id && "right-0"
                  )}
                >
                  <p className="text-sm text-sky-700 font-medium">
                    Are you sure?
                  </p>
                  <Button
                    className="w-fit h-8 px-4 text-sm"
                    variant={"default"}
                    onClick={() => onDeleteAttachment(att.id)}
                    disabled={isDeleting}
                  >
                    Confirm
                  </Button>
                  <Button
                    className="w-fit h-8 px-4 text-sm"
                    variant={"outline"}
                    onClick={() => setDeletingId(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </ul>
        )
      )}
      {isEditting && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={({ url, name }) => {
              if (url) {
                onSubmit({ attachments: { name, url } });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload a file (PDF, DOCX, etc.)
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
