import { Transformer } from "@napi-rs/image";
import { ReactElement } from "react";
import { NextResponse } from "next/server";
import type { SatoriOptions } from "satori";
import { ImageResponse as OriginalImageResponse } from "next/og";

export class ImageResponse {
  constructor(element: ReactElement, config: SatoriOptions) {
    return (async () => {
      try {
        const response = new OriginalImageResponse(element, config);
        const arrayBuffer = await response.arrayBuffer();
        const transformer = new Transformer(Buffer.from(arrayBuffer));

        const jpeg = await transformer.jpeg();

        return new NextResponse(jpeg, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=0, immutable",
          },
        });
      } catch (error) {
        console.error("Image generation failed:", error);
        return NextResponse.json(
          { error: "Failed to generate image" },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    })();
  }
}
