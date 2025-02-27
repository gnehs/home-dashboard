//@ts-nocheck
import { Transformer, compressJpeg } from "@napi-rs/image";
import { ReactElement } from "react";
import type { SatoriOptions } from "satori";
import { ImageResponse as OriginalImageResponse } from "next/og";
import sharp from "sharp";

export async function ImageResponse(
  element: ReactElement,
  config: SatoriOptions,
): Promise<Response> {
  const response = new OriginalImageResponse(element, config);
  const arrayBuffer = await response.arrayBuffer();

  const image = sharp(arrayBuffer)
    .flatten({ background: "#fff" })
    .negate()
    .grayscale()
    .jpeg({
      quality: 90,
    });

  const buffer = await image.toBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=0, immutable",
    },
  });
}
