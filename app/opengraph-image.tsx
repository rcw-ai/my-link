import { ImageResponse } from "next/og"
import { getKoreanFont } from "@/lib/getFont"

export const runtime = "edge"

export const alt = "MyLink - 단 하나의 링크로 모든 것을 연결하세요"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  const fontData = await getKoreanFont()

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
          backgroundColor: "#FDE047", // yellow-400 (primary)
          border: "24px solid #000000", // foreground
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            border: "12px solid #000000",
            boxShadow: "24px 24px 0px 0px #000000",
            padding: "40px 80px",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "120px",
              fontWeight: 900,
              color: "#000000",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "-0.05em",
            }}
          >
            MyLink
          </h1>
        </div>
        
        <p
          style={{
            fontSize: "48px",
            fontWeight: 900,
            color: "#000000",
            margin: 0,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          단 하나의 링크로, 모든 것을 연결하세요.
        </p>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Pretendard",
              data: fontData,
              style: "normal",
              weight: 900,
            },
          ]
        : undefined,
    }
  )
}
