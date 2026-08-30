import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d1210",
        }}
      >
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 48,
              height: 110,
              borderRadius: 12,
              backgroundColor: "#22302b",
              display: "flex",
            }}
          />
          <div
            style={{
              width: 48,
              height: 160,
              borderRadius: 12,
              backgroundColor: "#d87943",
              display: "flex",
            }}
          />
          <div
            style={{
              width: 48,
              height: 110,
              borderRadius: 12,
              backgroundColor: "#22302b",
              display: "flex",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#f5f6f4",
            letterSpacing: -2,
          }}
        >
          KanbanFlow
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#97a69f",
            marginTop: 16,
          }}
        >
          Modern task management, done right.
        </div>
      </div>
    ),
    { ...size },
  );
}
