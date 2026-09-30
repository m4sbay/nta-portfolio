import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const image = await readFile(path.join(process.cwd(), "public/nta.PNG"));

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: 64, height: 64, borderRadius: 25, overflow: "hidden" }}>
        {/* ImageResponse renders native image elements into the favicon PNG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${image.toString("base64")}`}
          alt=""
          width={64}
          height={64}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    size
  );
}
