"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";

type QRCodeProps = {
  value: string;
};

export default function QRCode({ value }: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCodeLib.toDataURL(value, { width: 160, margin: 1 })
      .then((url) => {
        if (active) {
          setDataUrl(url);
        }
      })
      .catch(() => {
        if (active) {
          setDataUrl(null);
        }
      });
    return () => {
      active = false;
    };
  }, [value]);

  if (!dataUrl) {
    return (
      <div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-rose-100 bg-white/80 text-xs text-rose-500">
        QR Code indisponivel
      </div>
    );
  }

  return (
    <Image
      src={dataUrl}
      alt="QR Code do Spotify"
      width={160}
      height={160}
      className="rounded-3xl border border-rose-100 bg-white/80 p-3 shadow-sm"
    />
  );
}
