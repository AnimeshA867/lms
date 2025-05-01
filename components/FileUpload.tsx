"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton, UploadDropzone } from "@/lib/uploadthings";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (data: { url?: string; name?: string }) => void;
  endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) =>
        onChange({ url: res?.[0].ufsUrl, name: res?.[0].name })
      }
      onUploadError={(error: Error) => {
        toast.error("Upload failed. Please try again.");
      }}
    />
  );
};

export default FileUpload;
