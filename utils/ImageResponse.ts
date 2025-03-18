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

  let image = sharp(arrayBuffer).flatten({ background: "#fff" });

  if (process.env.NEXT_PUBLIC_INVERT_COLOR === "true") {
    image = image.negate().grayscale();
  }

  image = image.jpeg({
    quality: 95,
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
