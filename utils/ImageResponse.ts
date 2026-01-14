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

  let transformer = new Transformer(input);

  if (process.env.NEXT_PUBLIC_INVERT_COLOR === "true") {
    transformer = transformer.invert().grayscale();
  }

  const buffer = await transformer.bmp();

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/bmp",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=0, immutable",
    },
  });
}
