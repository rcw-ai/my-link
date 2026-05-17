"use client"

import { useState, useEffect } from "react"
import { links as initialLinks, type Link } from "@/data/links"
import { userData } from "@/data/user"
import { AddLinkDialog } from "@/components/AddLinkDialog"
import { LinkItem } from "@/components/LinkItem"
import { db } from "@/lib/firebase"
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore"

export default function Page() {
  const [linkList, setLinkList] = useState<Link[]>(initialLinks)

  useEffect(() => {
    const q = query(collection(db, "users/anonymous/links"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Link[]
      
      setLinkList([...fetchedLinks, ...initialLinks])
    })

    return () => unsubscribe()
  }, [])

  const handleAddLink = async (newLink: Link) => {
    try {
      await addDoc(collection(db, "users/anonymous/links"), {
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon || "external-link",
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error adding link: ", error)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center px-6 py-16 selection:bg-primary selection:text-primary-foreground">
      {/* 프로필 섹션 */}
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-foreground" />
          <div className="relative border-4 border-foreground bg-primary p-1">
            <div className="h-24 w-24 bg-background flex items-center justify-center border-2 border-foreground">
              <span className="text-4xl font-black text-foreground">ML</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground bg-accent px-4 py-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                {userData.username} <span className="text-xl font-bold">Ryu Chan Whee</span>
            </h1>
            <p className="mt-4 font-bold text-lg text-foreground px-2">
                @{userData.displayName}
            </p>
        </div>
        
        <p className="mt-4 max-w-xs font-medium leading-relaxed text-muted-foreground italic">
          &quot;{userData.bio}&quot;
        </p>
      </div>

      {/* 링크 목록 */}
      <div className="flex w-full max-w-md flex-col gap-6">
        <AddLinkDialog onAdd={handleAddLink} />
        {linkList.map((link) => (
          <LinkItem key={link.id} link={link} />
        ))}
      </div>

      {/* 푸터 */}
      <footer className="mt-20 flex flex-col items-center gap-4">
        <div className="bg-foreground text-background px-4 py-1 font-black text-xs uppercase tracking-widest">
            Created with MyLink
        </div>
        <div className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center gap-2">
            <span>Next.js 16</span>
            <span className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span>Tailwind 4</span>
            <span className="h-1 w-1 bg-muted-foreground rounded-full" />
            <span>Remix Icon</span>
        </div>
        <div className="mt-4 flex items-center gap-2 px-3 py-1 border-2 border-foreground font-bold text-[10px] bg-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
            PRESS <kbd className="bg-foreground text-background px-1.5 py-0.5">D</kbd> FOR DARK MODE
        </div>
      </footer>
    </div>
  )
}
