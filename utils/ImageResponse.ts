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
  const transformer = new Transformer(Buffer.from(arrayBuffer));

  const image = await transformer.grayscale().jpeg(80);

  return new Response(image, {
    headers: {
      "Content-Type": "image/jpg",
      "Cache-Control": "public, max-age=0, immutable",
    },
  });
}
