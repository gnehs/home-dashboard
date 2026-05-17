//@ts-nocheck
import { Transformer } from "@napi-rs/image";
import { ReactElement } from "react";
import type { SatoriOptions } from "satori";
import { ImageResponse as OriginalImageResponse } from "next/og";

function shouldInvertColor(): boolean {
  return process.env["NEXT_PUBLIC_INVERT_COLOR"] === "true";
}

async function createInvertedGrayscaleImage(
  image: Transformer,
  width: number,
  height: number,
): Promise<Transformer> {
  const sourcePixels = await image.rawPixels();
  const pixelCount = width * height;
  const channels = sourcePixels.length / pixelCount;
  const outputPixels = new Uint8Array(pixelCount * 4);

  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
    const sourceIndex = pixelIndex * channels;
    const outputIndex = pixelIndex * 4;
    const red = sourcePixels[sourceIndex] ?? 0;
    const green = sourcePixels[sourceIndex + 1] ?? red;
    const blue = sourcePixels[sourceIndex + 2] ?? red;
    const alpha = channels >= 4 ? sourcePixels[sourceIndex + 3] : 255;
    const invertedGray = Math.round(
      (255 - red) * 0.299 + (255 - green) * 0.587 + (255 - blue) * 0.114,
    );

    outputPixels[outputIndex] = invertedGray;
    outputPixels[outputIndex + 1] = invertedGray;
    outputPixels[outputIndex + 2] = invertedGray;
    outputPixels[outputIndex + 3] = alpha;
  }

  return Transformer.fromRgbaPixels(outputPixels, width, height);
}

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
  const width = Number(meta.width);
  const height = Number(meta.height);

  // Create a white background (RGBA) and composite the source onto it
  const whitePixels = new Uint8Array(width * height * 4);
  whitePixels.fill(255);

  let composed = Transformer.fromRgbaPixels(whitePixels, width, height).overlay(
    input,
    0,
    0,
  );

  const invertColor = shouldInvertColor();

  if (invertColor) {
    composed = await createInvertedGrayscaleImage(composed, width, height);
  }

  // Encode as JPEG
  const buffer = await composed.jpeg(90);

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=0, immutable",
    },
  });
}
