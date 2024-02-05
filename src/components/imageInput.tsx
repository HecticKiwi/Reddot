"use client";

import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { ControllerRenderProps } from "react-hook-form";
import CircleImage from "./circleImage";
import { Input } from "./ui/input";

const ImageInput = ({
  field,
  imagePreviewUrl,
  isSubmitting,
}: {
  field: Omit<ControllerRenderProps, "value">;
  imagePreviewUrl?: string | null;
  isSubmitting: boolean;
}) => {
  const fileUpload = useRef<HTMLInputElement>(null);
  const addFileButton = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Input
        type="file"
        {...field}
        ref={fileUpload}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];

          if (file) {
            field.onChange(file);
          }
        }}
        className="hidden"
        accept="image/*"
      />

      <div className="relative h-32 w-32">
        {/* Image preview */}
        <CircleImage
          src={imagePreviewUrl}
          alt={`Image Preview`}
          className="h-32 w-32 border"
          fallbackClassName="bg-transparent"
        />

        {/* Add image button */}
        <button
          ref={addFileButton}
          className="absolute left-0 top-0 h-32 w-32 rounded-full bg-black/30 opacity-0 ring-2 ring-ring ring-offset-2 ring-offset-background focus-within:opacity-100 hover:opacity-100 focus-visible:outline-none disabled:hidden disabled:cursor-not-allowed"
          onClick={() => {
            if (addFileButton.current) {
              addFileButton.current.blur();
            }
            fileUpload.current?.click();
          }}
          type="button"
          disabled={isSubmitting}
        >
          <Camera className="mx-auto h-16 w-16 text-primary" />
        </button>

        {/* Delete image button */}
        {imagePreviewUrl && (
          <Button
            onClick={() => {
              if (fileUpload.current) {
                fileUpload.current.value = "";
              }
              field.onChange(null);
            }}
            type="button"
            size={"icon"}
            variant="destructive"
            disabled={isSubmitting}
            className="absolute right-2 top-2 h-6 w-6 rounded-full disabled:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
};

export default ImageInput;
