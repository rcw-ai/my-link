"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { auth, db } from "@/lib/firebase"
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"
import { onAuthStateChanged, User } from "firebase/auth"
import { type Link as LinkType } from "@/data/links"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  RiBarChartBoxLine,
  RiCursorLine,
  RiArrowLeftLine,
  RiExternalLinkLine,
} from "@remixicon/react"

export default function StatsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthInitialized(true)
    })
    return () => unsub()
  }, [])

  // 비로그인 시 리다이렉트
  useEffect(() => {
    if (authInitialized && !user) {
      router.replace("/")
    }
  }, [authInitialized, user, router])

  // 프로필 조회
  const { data: profile } = useQuery({
    queryKey: ["statsProfile", user?.uid],
    queryFn: async () => {
      if (!user) return null
      const snap = await getDoc(doc(db, "users", user.uid))
      if (!snap.exists()) return null
      const data = snap.data()
      return {
        username: data.username || "User",
        displayName: data.displayName || "user",
      }
    },
    enabled: !!user,
  })

  // 링크 + 클릭 수 조회
  const { data: links = [], isLoading } = useQuery({
    queryKey: ["statsLinks", user?.uid],
    queryFn: async () => {
      if (!user) return []
      const q = query(
        collection(db, `users/${user.uid}/links`),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<LinkType, "id">),
        clickCount: (d.data().clickCount as number) ?? 0,
      })) as (LinkType & { clickCount: number })[]
    },
    enabled: !!user,
  })

  if (!authInitialized || (user && isLoading)) {
    return (
      <div className="flex min-h-svh items-center justify-center font-bold text-xl uppercase">
        Loading...
      </div>
    )
  }

  if (!user) return null

  // 집계
  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0)
  const topLink = links.reduce(
    (best, l) => (l.clickCount > best.clickCount ? l : best),
    links[0] ?? null
  )

  // 차트 데이터: 클릭 수 내림차순
  const chartData = [...links]
    .sort((a, b) => b.clickCount - a.clickCount)
    .map((l) => ({
      title: l.title.length > 10 ? l.title.slice(0, 10) + "…" : l.title,
      fullTitle: l.title,
      clicks: l.clickCount,
      url: l.url,
    }))

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  // 순위별 색상
  const BAR_COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--chart-2, 217 91% 60%))",
    "hsl(var(--chart-3, 47 96% 53%))",
    "hsl(var(--chart-4, 142 71% 45%))",
    "hsl(var(--chart-5, 0 84% 60%))",
  ]

  return (
    <div className="flex min-h-svh flex-col items-center px-6 py-16 selection:bg-primary selection:text-primary-foreground">
      {/* 헤더 */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-12">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-foreground bg-primary px-3 py-1 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] dark:hover:shadow-none">
          MyLink
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 font-black uppercase border-4 border-foreground px-4 py-2 bg-background hover:bg-secondary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
        >
          <RiArrowLeftLine size={18} />
          돌아가기
        </Link>
      </header>

      <main className="w-full max-w-2xl flex flex-col gap-8">
        {/* 페이지 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
            <RiBarChartBoxLine size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              링크 통계
            </h1>
            {profile && (
              <p className="text-sm font-bold text-muted-foreground">
                @{profile.displayName}
              </p>
            )}
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 총 클릭 수 */}
          <div className="relative border-4 border-foreground bg-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <RiCursorLine size={18} className="text-muted-foreground" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                총 클릭 수
              </span>
            </div>
            <p className="text-5xl font-black tabular-nums">{totalClicks.toLocaleString()}</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              링크 {links.length}개 합산
            </p>
          </div>

          {/* 최다 클릭 링크 */}
          <div className="relative border-4 border-foreground bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <RiExternalLinkLine size={18} className="text-foreground/70" />
              <span className="text-xs font-black uppercase tracking-widest text-foreground/70">
                최다 클릭
              </span>
            </div>
            {topLink ? (
              <>
                <p className="text-xl font-black leading-tight line-clamp-2 break-all">
                  {topLink.title}
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums">
                  {topLink.clickCount.toLocaleString()}
                  <span className="text-sm font-bold text-foreground/60 ml-1">클릭</span>
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-foreground/60">데이터 없음</p>
            )}
          </div>
        </div>

        {/* 차트 */}
        <div className="border-4 border-foreground bg-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-6">
          <h2 className="text-base font-black uppercase tracking-tight mb-6">
            링크별 클릭 수
          </h2>

          {links.length === 0 ? (
            <div className="flex items-center justify-center h-40 border-4 border-dashed border-foreground text-muted-foreground font-bold">
              아직 링크가 없습니다.
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <XAxis
                  dataKey="title"
                  tick={{ fontFamily: "inherit", fontWeight: 700, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontFamily: "inherit", fontWeight: 700, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={{ fill: "currentColor", fillOpacity: 0.05 }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fullTitle ?? ""
                      }
                    />
                  }
                />
                <Bar dataKey="clicks" radius={0} maxBarSize={56}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </div>

        {/* 링크별 상세 순위표 */}
        <div className="border-4 border-foreground bg-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]">
          <div className="border-b-4 border-foreground px-6 py-4">
            <h2 className="text-base font-black uppercase tracking-tight">상세 순위</h2>
          </div>
          {links.length === 0 ? (
            <div className="p-8 text-center font-bold text-muted-foreground">
              데이터가 없습니다.
            </div>
          ) : (
            <ul className="divide-y-4 divide-foreground">
              {[...links]
                .sort((a, b) => b.clickCount - a.clickCount)
                .map((link, i) => {
                  const maxClicks = Math.max(...links.map((l) => l.clickCount), 1)
                  const pct = Math.round((link.clickCount / maxClicks) * 100)
                  return (
                    <li key={link.id} className="flex items-center gap-4 px-6 py-4">
                      {/* 순위 */}
                      <span
                        className="w-8 h-8 flex items-center justify-center border-2 border-foreground font-black text-sm shrink-0"
                        style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
                      >
                        {i + 1}
                      </span>

                      {/* 링크 정보 + 게이지 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                          <span className="font-black truncate text-sm">{link.title}</span>
                          <span className="text-sm font-black tabular-nums shrink-0">
                            {link.clickCount.toLocaleString()}
                            <span className="text-xs font-bold text-muted-foreground ml-0.5">클릭</span>
                          </span>
                        </div>
                        {/* 게이지 바 */}
                        <div className="h-2 w-full border-2 border-foreground bg-secondary">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: BAR_COLORS[i % BAR_COLORS.length],
                            }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] font-bold text-muted-foreground truncate">
                          {link.url}
                        </p>
                      </div>
                    </li>
                  )
                })}
            </ul>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-20 flex flex-col items-center gap-4">
        <div className="bg-foreground text-background px-4 py-1 font-black text-xs uppercase tracking-widest">
          Created with MyLink
        </div>
      </footer>
    </div>
  )
}
