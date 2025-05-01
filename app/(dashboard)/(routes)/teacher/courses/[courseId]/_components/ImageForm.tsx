"use client";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ImageIcon, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().url({
    message: "Please enter a valid URL",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData.imageUrl || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    if (isEditting) {
      form.reset();
    }
    setIsEditting((prev) => !prev);
  };

  const onSubmit = async (imageUrl: z.infer<typeof formSchema>) => {
    try {
      console.log(imageUrl);
      await axios.patch(`/api/courses/${courseId}`, imageUrl);
      toast.success("Course image updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update course image");
      console.error("Failed to update course image:", error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? (
            <>
              <X /> Edit Image
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" /> Add an Image
            </>
          )}
        </Button>
      </div>
      {!isEditting && !initialData.imageUrl ? (
        <div className="flex items-center justify-center h-60 bg-slate rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      ) : (
        initialData.imageUrl && (
          <div className="relative aspect-video mt-2">
            <>
              <Image
                fill
                alt="Upload"
                className="object-cover rounded-md"
                src={initialData.imageUrl}
              />
            </>
          </div>
        )
      )}
      {isEditting && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={({ url }) => {
              if (url) {
                console.log("Image uploaded successfully:", url);
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
