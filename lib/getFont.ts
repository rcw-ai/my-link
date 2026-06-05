export async function getKoreanFont() {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } } // User-Agent helps ensure we get standard woff2/ttf
    )
    const css = await cssRes.text()
    
    // Google fonts API might return woff2 or ttf depending on user agent.
    // To ensure we get a TTF that satori supports, we should look for 'truetype' or 'opentype'.
    // Alternatively, we can force a request to a known TTF fallback URL.
    
    // Better approach for Satori: fetch from a reliable TTF source directly.
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
