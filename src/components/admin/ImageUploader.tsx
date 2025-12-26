"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import NextImage from "next/image";
import { uploadImageAction } from "@/app/admin/actions";
import { usePrefersReducedMotion } from "@/lib/hooks";

type ImageUploaderProps = {
  folder: string;
  label: string;
  aspect?: number;
  onUploaded: (path: string) => void;
  previewUrl?: string | null;
};

const MAX_WIDTH = 1600;

async function createImage(url: string): Promise<HTMLImageElement> {
  const image = new window.Image();
  image.src = url;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
  return image;
}

async function getCroppedBlob(
  imageSrc: string,
  crop: Area,
  mimeType: string,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const width = Math.min(crop.width * scaleX, MAX_WIDTH);
  const height = (crop.height * scaleY * width) / (crop.width * scaleX);

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas unavailable.");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    width,
    height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to crop image."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      0.9,
    );
  });
}

export default function ImageUploader({
  folder,
  label,
  aspect = 4 / 3,
  onUploaded,
  previewUrl,
}: ImageUploaderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setImageSrc(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setError("Selecione uma imagem.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const mimeType = "image/webp";
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels, mimeType);
      const file = new File([blob], "upload.webp", { type: mimeType });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const result = await uploadImageAction(formData);
      if (!result.ok || !result.path) {
        setError(result.message ?? "Erro ao enviar.");
        return;
      }
      onUploaded(result.path);
      setImageSrc(null);
    } catch {
      setError("Erro ao recortar ou enviar.");
    } finally {
      setLoading(false);
    }
  };

  const cropper = useMemo(() => {
    if (!imageSrc) return null;
    return (
      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-rose-50">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          showGrid={!prefersReducedMotion}
        />
      </div>
    );
  }, [imageSrc, crop, zoom, aspect, onCropComplete, prefersReducedMotion]);

  return (
    <div className="rounded-3xl border border-rose-100 bg-white/80 p-4">
      <label className="block text-sm font-medium text-rose-700">
        {label}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-3 py-2 text-sm text-rose-700"
        />
      </label>
      {imageSrc ? (
        <div className="mt-4 space-y-3">
          {cropper}
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full"
            aria-label="Zoom"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Enviando..." : "Salvar recorte"}
          </button>
        </div>
      ) : null}
      {previewUrl ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-500/70">
            Preview atual
          </p>
          <div className="relative mt-2 h-32 w-full overflow-hidden rounded-2xl border border-rose-100">
            <NextImage
              src={previewUrl}
              alt="Preview da imagem"
              fill
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
