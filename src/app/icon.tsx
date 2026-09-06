import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          backgroundColor: "#0d1210",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 6,
            height: 14,
            borderRadius: 2,
            backgroundColor: "#22302b",
            display: "flex",
          }}
        />
        <div
          style={{
            width: 6,
            height: 20,
            borderRadius: 2,
            backgroundColor: "#d87943",
            display: "flex",
          }}
        />
        <div
          style={{
            width: 6,
            height: 14,
            borderRadius: 2,
            backgroundColor: "#22302b",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
