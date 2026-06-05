"use client"

import { Button } from "@/components/ui/button"
import { RiFlashlightLine, RiPaintBrushLine, RiBarChartBoxLine, RiArrowRightUpLine, RiLinkM } from "@remixicon/react"

interface LandingViewProps {
  onLogin: () => void
}

export function LandingView({ onLogin }: LandingViewProps) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* 헤더 */}
      <header className="w-full max-w-5xl flex justify-between items-center px-6 py-8">
        <div className="text-3xl font-black uppercase tracking-tighter text-foreground bg-primary px-4 py-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] dark:hover:shadow-none cursor-default">
          MyLink
        </div>
        <Button onClick={onLogin} className="border-4 border-foreground bg-background text-foreground hover:bg-accent font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all rounded-none px-4 sm:px-6 py-6 text-sm sm:text-lg">
          시작하기
        </Button>
      </header>

      {/* Hero 섹션 */}
      <main className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:py-24 gap-16">
        {/* 왼쪽 카피 영역 */}
        <div className="flex-1 flex flex-col items-start gap-8 z-10 w-full">
          <div className="inline-flex items-center gap-2 border-4 border-foreground bg-accent px-4 py-2 font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
            <RiFlashlightLine className="animate-pulse text-yellow-500" />
            무료로 만드는 멀티 프로필
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground break-keep">
            하나의 <span className="text-primary underline decoration-8 underline-offset-[12px]">링크</span>로<br />
            모든 것을<br />
            연결하세요.
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-muted-foreground break-keep max-w-lg mt-4">
            나만의 개성 있는 멀티 링크 페이지를 3초 만에 만들고 어디든 공유하세요.
          </p>
          <Button
            onClick={onLogin}
            className="mt-4 w-full sm:w-auto px-8 sm:px-12 py-8 text-xl sm:text-2xl border-4 border-foreground bg-primary text-foreground hover:bg-primary/90 font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-all rounded-none group"
          >
            내 페이지 만들기
            <RiArrowRightUpLine className="ml-2 group-hover:rotate-45 transition-transform" size={32} />
          </Button>
        </div>

        {/* 오른쪽 목업 영역 */}
        <div className="flex-1 w-full max-w-md relative flex justify-center items-center mt-12 lg:mt-0">
          {/* 장식용 배경 요소 */}
          <div className="absolute inset-0 bg-secondary border-4 border-foreground translate-x-4 translate-y-4" />
          
          {/* 가상 폰 목업 */}
          <div className="relative w-full border-4 border-foreground bg-background p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] flex flex-col items-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* 프로필 이미지 가짜 */}
            <div className="h-24 w-24 bg-primary border-4 border-foreground flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-4xl font-black">👋</span>
            </div>
            <div className="h-8 w-40 bg-accent border-4 border-foreground mb-2" />
            <div className="h-4 w-32 bg-muted-foreground/20 mb-8" />

            {/* 가짜 링크 버튼들 */}
            <div className="w-full flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-16 border-4 border-foreground bg-background flex items-center px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                  <div className="h-8 w-8 bg-secondary border-2 border-foreground flex items-center justify-center mr-4">
                    <RiLinkM size={16} />
                  </div>
                  <div className="h-4 w-3/5 bg-foreground" />
                </div>
              ))}
            </div>
          </div>
          
          {/* 부유하는 장식 */}
          <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-16 h-16 sm:w-20 sm:h-20 bg-accent border-4 border-foreground rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce z-20">
            <span className="text-2xl sm:text-3xl font-black">✨</span>
          </div>
        </div>
      </main>

      {/* 특징 (Features) 섹션 */}
      <section className="w-full max-w-5xl px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="border-4 border-foreground bg-background p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 bg-primary border-4 border-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <RiFlashlightLine size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 break-keep">초간단 인라인 편집</h3>
            <p className="font-bold text-muted-foreground break-keep leading-relaxed">
              복잡한 설정 화면 없이 텍스트를 클릭해서 바로 수정하세요. 가장 직관적이고 빠른 프로필 편집을 경험할 수 있습니다.
            </p>
          </div>
          <div className="border-4 border-foreground bg-background p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-2 transition-transform md:translate-y-4">
            <div className="w-16 h-16 bg-accent border-4 border-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <RiPaintBrushLine size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 break-keep">힙한 브루탈리즘</h3>
            <p className="font-bold text-muted-foreground break-keep leading-relaxed">
              트렌디한 굵은 테두리와 강렬한 색상. D키를 눌러 눈이 편안한 매력적인 다크모드로 언제든 전환할 수 있습니다.
            </p>
          </div>
          <div className="border-4 border-foreground bg-background p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-2 transition-transform md:translate-y-8">
            <div className="w-16 h-16 bg-secondary border-4 border-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-foreground">
              <RiBarChartBoxLine size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 break-keep">상세한 클릭 통계</h3>
            <p className="font-bold text-muted-foreground break-keep leading-relaxed">
              방문자들이 어떤 링크를 얼마나 클릭했는지 상세한 순위표와 예쁜 차트로 로그인 즉시 한눈에 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="w-full max-w-5xl flex flex-col items-center justify-center gap-6 px-6 py-20 border-t-4 border-foreground mt-auto">
        <div className="text-4xl font-black uppercase tracking-tighter text-foreground bg-primary px-4 py-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          MyLink
        </div>
        <p className="font-bold text-muted-foreground uppercase text-sm text-center">
          © 2026 MyLink. Build your own multi-link page.<br/>
          Press <kbd className="bg-foreground text-background px-1.5 py-0.5 ml-1">D</kbd> for dark mode.
        </p>
      </footer>
    </div>
  )
}
