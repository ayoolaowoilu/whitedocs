// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// Logo SVG as a data URI component
const LogoSVG = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 2V8H20" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18V12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 15L12 12L15 15" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "WhiteDocs";
  const description =
    searchParams.get("description") ||
    "Free Open Source PDF Editor";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          position: "relative",
        }}
      >
        {/* Subtle background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 30% 20%, #fef2f2 0%, transparent 50%), radial-gradient(circle at 70% 80%, #fef2f2 0%, transparent 50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "#dc2626",
              boxShadow: "0 8px 32px rgba(220, 38, 38, 0.25)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M14 2V8H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 18V12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 15L12 12L15 15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "800",
                color: "#111827",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                textAlign: "center",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "28px",
                color: "#6b7280",
                textAlign: "center",
                margin: 0,
                maxWidth: "700px",
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          </div>

          {/* Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#dc2626",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#dc2626",
                letterSpacing: "0.02em",
              }}
            >
              FREE & OPEN SOURCE
            </span>
          </div>
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M14 2V8H20" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 18V12" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 15L12 12L15 15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              fontWeight: "500",
            }}
          >
            whitedocs.dev
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}