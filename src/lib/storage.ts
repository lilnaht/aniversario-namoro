import "server-only";

import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { config, maxUploadBytes } from "@/lib/config";
import { logError, logInfo } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase/admin";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

function getExtension(mimeType: string) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "bin";
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Tipo de imagem nao suportado.");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("Imagem muito grande.");
  }

  const extension = getExtension(file.type);
  const fileName = `${folder}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (config.mockData) {
    const targetPath = path.join(process.cwd(), "public", "uploads", fileName);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, buffer);
    logInfo("Mock upload saved", { path: fileName });
    return fileName;
  }

  if (!supabaseAdmin) {
    throw new Error("Supabase admin client nao configurado.");
  }

  const { error } = await supabaseAdmin.storage.from("romantic").upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    logError("Failed to upload image", error);
    throw new Error("Erro ao enviar imagem.");
  }

  logInfo("Image uploaded", { path: fileName });
  return fileName;
}
