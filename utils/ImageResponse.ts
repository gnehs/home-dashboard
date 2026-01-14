//@ts-nocheck
import { Transformer } from "@napi-rs/image";
import { ReactElement } from "react";
import type { SatoriOptions } from "satori";
import { ImageResponse as OriginalImageResponse } from "next/og";

export async function ImageResponse(
  element: ReactElement,
  config: SatoriOptions,
): Promise<Response> {
  const response = new OriginalImageResponse(element, config);
  const arrayBuffer = await response.arrayBuffer();

  const input = Buffer.from(arrayBuffer);

  // Create a source transformer to read metadata
  const src = new Transformer(input);
  const meta = await src.metadata();
  const width = meta.width;
  const height = meta.height;

  // Create a white background (RGBA) and composite the source onto it
  const whitePixels = new Uint8Array(width * height * 4);
  whitePixels.fill(255);

  let composed = Transformer.fromRgbaPixels(whitePixels, width, height).overlay(input, 0, 0);

  if (process.env.NEXT_PUBLIC_INVERT_COLOR === "true") {
    composed = composed.invert().grayscale();
  }

  // Encode as BMP (should be 24-bit RGB after compositing)
  const buffer = await composed.bmp();

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/bmp",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=0, immutable",
    },
  });
}
