"use client";

import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Button from "./button";

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
  initImageUrl?: string;
  imageRemoved?: (value: boolean) => void;
}

export function ImageUpload({ onImageUpload, initImageUrl, imageRemoved }: ImageUploadProps) {
  const [initImageUrlState, setInitImageUrlState] = useState<string | undefined> (initImageUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageUpload(file);
        setError(null);
      } else {
        setError("Please select an image file.");
        setPreview(null);
      }
    }
  };

  const handleRemoveImage = () => {
    if (preview) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onImageUpload(null);
    }else if (initImageUrl) {
      imageRemoved!(true);
      setInitImageUrlState(undefined);
      onImageUpload(null);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center space-y-4">
      <div className="relative">
        <Button
          onClick={handleUploadClick}
          className="w-64 h-64 bg-transparent border border-champagne"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : initImageUrlState ? (
            <img
              src={initImageUrlState}
              alt="current image"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="w-8 h-8 text-champagne" />
          )}
        </Button>
        {(preview || initImageUrlState) && (
          <Button
            onClick={handleRemoveImage}
            className="absolute bg-red-500 text-white -top-2 -right-2 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
