"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageInput } from "@/core/models/types";

interface Props {
  onSubmit: (image: ImageInput) => void;
  loading: boolean;
}

function readFileAsImageInput(file: File): Promise<ImageInput> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const match = result.match(/^data:(.+);base64,(.*)$/);
      if (!match) {
        reject(new Error("Không đọc được file ảnh."));
        return;
      }
      resolve({ mediaType: match[1], data: match[2] });
    };
    reader.onerror = () => reject(new Error("Không đọc được file ảnh."));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ onSubmit, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<ImageInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một file ảnh.");
      return;
    }
    if (file.size > 9 * 1024 * 1024) {
      setError("Ảnh quá lớn (tối đa ~9MB). Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    try {
      const image = await readFileAsImageInput(file);
      setPendingImage(image);
      setPreview(`data:${image.mediaType};base64,${image.data}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không đọc được file ảnh.");
    }
  }

  // Support the common "screenshot then Ctrl+V" workflow: while this
  // uploader is mounted, any paste anywhere on the page is checked for an
  // image and used directly - pasting again simply replaces the current one.
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      if (loading) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
          }
          break;
        }
      }
    }

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [loading]);

  function reset() {
    setPreview(null);
    setPendingImage(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      {!preview && (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded-sm px-6 py-10 cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors">
          <span className="text-sm text-stone-500">
            Chọn ảnh chứa văn bản tiếng Nhật (screenshot, ảnh chụp trang sách...)
          </span>
          <span className="text-xs text-stone-400">
            hoặc dán trực tiếp bằng Ctrl+V (Cmd+V trên Mac) · JPG, PNG, WEBP, GIF...
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}

      {preview && (
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Ảnh đã chọn"
            className="max-h-80 w-auto rounded-sm border border-stone-200 object-contain self-start"
          />
          <div className="flex gap-2">
            <button
              onClick={() => pendingImage && onSubmit(pendingImage)}
              disabled={loading}
              className="bg-stone-800 text-stone-50 text-sm px-5 py-2.5 rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đọc ảnh..." : "Dịch ảnh này"}
            </button>
            <button
              onClick={reset}
              disabled={loading}
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-40"
            >
              Chọn ảnh khác
            </button>
          </div>
          <p className="text-xs text-stone-400">Mẹo: dán ảnh mới (Ctrl+V) để thay thế ảnh này.</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
