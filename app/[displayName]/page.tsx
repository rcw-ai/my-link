"use client"

import * as React from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { type Link } from "@/data/links"
import { LinkItem } from "@/components/LinkItem"
import { useQuery } from "@tanstack/react-query"

interface PageProps {
  params: Promise<{
    displayName: string
  }>
}

export default function VisitorPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const displayName = decodeURIComponent(resolvedParams.displayName)
  
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["visitorProfile", displayName],
    queryFn: async () => {
      const q = query(collection(db, "users"), where("displayName", "==", displayName))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }

      const userDoc = querySnapshot.docs[0]
      const data = userDoc.data()
      
      return {
        uid: userDoc.id,
        username: data.username || "User",
        displayName: data.displayName || displayName,
        bio: data.bio || "한줄 소개를 입력해주세요"
      }
    }
  })

  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["visitorLinks", profile?.uid],
    queryFn: async () => {
      if (!profile?.uid) return []
      const linksQ = query(collection(db, `users/${profile.uid}/links`), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(linksQ)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Link[]
    },
    enabled: !!profile?.uid
  })

  if (isProfileLoading) {
    return <div className="flex min-h-svh items-center justify-center font-bold text-xl uppercase">Loading...</div>
  }

  if (!profile) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex w-full max-w-md flex-col items-center justify-center p-12 border-4 border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] text-center gap-8">
          <div className="text-6xl animate-bounce">🕵️‍♂️</div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase text-foreground break-keep">페이지를 찾을 수 없습니다</h2>
            <p className="font-bold text-muted-foreground break-keep text-lg">
              존재하지 않거나 삭제된 마이링크 페이지입니다.
            </p>
          </div>
          <a
            href="/"
            className="w-full text-center py-4 border-4 border-foreground bg-primary text-foreground hover:bg-primary/90 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            내 마이링크 만들기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center px-6 py-16 selection:bg-primary selection:text-primary-foreground">
      {/* 헤더 */}
      <header className="w-full max-w-md flex justify-center mb-12">
        <div className="text-2xl font-black uppercase tracking-tighter text-foreground bg-primary px-3 py-1 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
          MyLink
        </div>
      </header>

      {/* 프로필 섹션 */}
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-12 flex flex-col items-center text-center w-full">
          <div className="relative mb-6">
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-foreground" />
            <div className="relative border-4 border-foreground bg-primary p-1">
              <div className="h-24 w-24 bg-background flex items-center justify-center border-2 border-foreground overflow-hidden">
                <span className="text-4xl font-black text-foreground">
                  {profile.username.substring(0, 2).toUpperCase() || "ML"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground bg-accent px-4 py-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
              {profile.username}
            </h1>
            <p className="font-bold text-lg text-foreground px-2">
              @{profile.displayName}
            </p>
          </div>

          <p className="mt-6 max-w-xs font-medium leading-relaxed text-muted-foreground italic">
            &quot;{profile.bio}&quot;
          </p>
        </div>

        {/* 링크 목록 */}
        <div className="flex w-full flex-col gap-6">
          {isLinksLoading ? (
            <div className="text-center font-bold text-muted-foreground">링크 로딩 중...</div>
          ) : links.length === 0 ? (
            <div className="border-4 border-dashed border-foreground p-8 text-center font-bold text-muted-foreground">
              아직 등록된 링크가 없습니다.
            </div>
          ) : (
            links.map((link) => (
              <LinkItem key={link.id} link={link} userId={profile.uid} readOnly={true} />
            ))
          )}
        </div>
      </div>

      {/* 푸터 */}
      <footer className="mt-20 flex flex-col items-center gap-4">
        <a 
          href="/"
          className="bg-foreground text-background px-4 py-1 font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Create your own MyLink
        </a>
      </footer>
    </div>
  )
}
