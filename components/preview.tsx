"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  return (
    <div className="bg-white">
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly
        className="rounded-full"
      />
    </div>
  );
};
