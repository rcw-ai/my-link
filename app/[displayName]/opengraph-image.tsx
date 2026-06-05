import { ImageResponse } from "next/og"
import { getKoreanFont } from "@/lib/getFont"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

export const alt = "MyLink Profile"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

interface Props {
  params: Promise<{
    displayName: string
  }>
}

export default async function Image({ params }: Props) {
  const fontData = await getKoreanFont()
  const resolvedParams = await params
  const displayName = decodeURIComponent(resolvedParams.displayName)

  // Fetch user data from Firebase
  let username = "User"
  let bio = "마이링크 프로필"
  
  try {
    const q = query(collection(db, "users"), where("displayName", "==", displayName))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data()
      username = data.username || "User"
      bio = data.bio || "마이링크 프로필"
    }
  } catch (error) {
    console.error("Failed to fetch user for OG image:", error)
  }

  const initial = username.substring(0, 2).toUpperCase() || "ML"

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
          border: "24px solid #000000",
          padding: "80px",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "120px",
            height: "120px",
            backgroundColor: "#A3E635", // accent (green-400)
            border: "12px solid #000000",
            borderRadius: "60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            width: "160px",
            height: "160px",
            backgroundColor: "#FDE047", // primary (yellow-400)
            border: "12px solid #000000",
          }}
        />

        {/* Profile Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            border: "12px solid #000000",
            boxShadow: "24px 24px 0px 0px #000000",
            padding: "60px",
            width: "800px",
            zIndex: 10,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              backgroundColor: "#FDE047",
              border: "8px solid #000000",
              boxShadow: "12px 12px 0px 0px #000000",
              marginBottom: "40px",
            }}
          >
            <span style={{ fontSize: "80px", fontWeight: 900, color: "#000000" }}>
              {initial}
            </span>
          </div>

          {/* Name & DisplayName */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#000000",
              margin: "0 0 16px 0",
              textAlign: "center",
              letterSpacing: "-0.05em",
            }}
          >
            {username}
          </h1>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#000000",
              margin: "0 0 40px 0",
              backgroundColor: "#A3E635",
              padding: "8px 24px",
              border: "6px solid #000000",
            }}
          >
            @{displayName}
          </p>

          {/* Bio */}
          <p
            style={{
              fontSize: "32px",
              fontWeight: 900,
              color: "#666666",
              margin: 0,
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            &quot;{bio}&quot;
          </p>
        </div>
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
