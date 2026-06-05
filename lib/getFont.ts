export async function getKoreanFont() {
  try {
    // Better approach for Satori: fetch from a reliable TTF/OTF source directly.
    const fontRes = await fetch(
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Black.otf"
    )
    
    if (!fontRes.ok) {
      throw new Error("Failed to fetch font")
    }
    
    const fontData = await fontRes.arrayBuffer()
    return fontData
  } catch (error) {
    console.error("Error loading font", error)
    return null
  }
}
