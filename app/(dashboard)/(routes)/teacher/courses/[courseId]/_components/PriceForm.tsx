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
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface PriceFormProps {
  initialData: {
    price: number | null;
  };
  courseId: string;
}

const formSchema = z.object({
  price: z
    .number({ invalid_type_error: "Price is required" })
    .min(0, { message: "Price must be at least 0" }),
});

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter();
  const [isEditting, setIsEditting] = useState(initialData.price === null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price ?? 0,
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
      await axios.patch(`/api/courses/${courseId}`, { price: data.price });
      toast.success("Course price updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update course price");
      console.error("Failed to update course price:", error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course price
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditting ? <>Cancel</> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {!isEditting && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price !== null && initialData.price !== undefined
            ? formatPrice(initialData.price)
            : "No price selected"}
        </p>
      )}
      {isEditting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value)
                        )
                      }
                      value={field.value === 0 ? "" : field.value}
                      disabled={isSubmitting}
                      placeholder="Set a price for your course."
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;
