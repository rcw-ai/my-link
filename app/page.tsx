"use client"

import { useState, useEffect } from "react"
import { type Link } from "@/data/links"
import { userData } from "@/data/user"
import { AddLinkDialog } from "@/components/AddLinkDialog"
import { LinkItem } from "@/components/LinkItem"
import { auth, db, googleProvider } from "@/lib/firebase"
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { RiFileCopyLine, RiCheckLine, RiLogoutBoxLine } from "@remixicon/react"

export default function Page() {
  const [linkList, setLinkList] = useState<Link[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bio, setBio] = useState("한줄 소개를 입력해주세요")
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempBio, setTempBio] = useState("")

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthInitialized(true)
    })
    return () => unsubscribeAuth()
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data().bio) {
          setBio(userDoc.data().bio)
        } else {
          setBio("한줄 소개를 입력해주세요")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }
    fetchProfile()

    const q = query(collection(db, `users/${user.uid}/links`), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Link[]

      setLinkList(fetchedLinks)
    })

    return () => unsubscribe()
  }, [user])

  const handleAddLink = async (newLink: Link) => {
    if (!user) return
    try {
      await addDoc(collection(db, `users/${user.uid}/links`), {
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon || "external-link",
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error adding link: ", error)
    }
  }

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setLinkList([])
      setBio("한줄 소개를 입력해주세요")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleCopyLink = () => {
    if (!user) return
    navigator.clipboard.writeText(`${window.location.origin}/@${user.email?.split('@')[0] || "user"}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBioSave = async () => {
    setIsEditingBio(false)
    if (tempBio !== bio && user) {
      setBio(tempBio)
      try {
        await setDoc(doc(db, "users", user.uid), { bio: tempBio }, { merge: true })
      } catch (error) {
        console.error("Error saving bio:", error)
        setBio(bio) // revert on error
      }
    }
  }

  if (!authInitialized) {
    return <div className="flex min-h-svh items-center justify-center font-bold text-xl uppercase">Loading...</div>
  }

  return (
    <div className="flex min-h-svh flex-col items-center px-6 py-16 selection:bg-primary selection:text-primary-foreground">
      {/* 헤더 */}
      <header className="w-full max-w-md flex justify-between items-center mb-12">
        <div className="text-2xl font-black uppercase tracking-tighter text-foreground bg-primary px-3 py-1 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
          MyLink
        </div>
        {user ? (
          <div className="relative group">
            <div className="h-10 w-10 border-2 border-foreground bg-background overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center w-full h-full font-black text-sm text-foreground">
                  {user.displayName?.substring(0, 2).toUpperCase() || "ML"}
                </span>
              )}
            </div>
            
            <div className="absolute right-0 mt-2 w-48 border-4 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 origin-top-right">
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-3 text-left font-bold uppercase border-b-2 border-foreground hover:bg-secondary text-foreground transition-colors"
              >
                {copied ? <RiCheckLine size={18} /> : <RiFileCopyLine size={18} />}
                {copied ? "복사완료!" : "링크 복사"}
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 text-left font-bold uppercase hover:bg-destructive text-foreground hover:text-destructive-foreground transition-colors"
              >
                <RiLogoutBoxLine size={18} />
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <Button onClick={handleLogin} className="border-4 border-foreground bg-primary text-foreground hover:bg-primary/90 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all rounded-none">
            Login
          </Button>
        )}
      </header>

      {/* 메인 콘텐츠 (로그인 여부에 따라 분기) */}
      {user ? (
        <div className="flex w-full max-w-md flex-col items-center">
          {/* 프로필 섹션 */}
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-foreground" />
              <div className="relative border-4 border-foreground bg-primary p-1">
                <div className="h-24 w-24 bg-background flex items-center justify-center border-2 border-foreground overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-foreground">{user.displayName?.substring(0, 2).toUpperCase() || "ML"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground bg-accent px-4 py-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                {user.displayName || "User"}
              </h1>
              <p className="mt-4 font-bold text-lg text-foreground px-2">
                @{user.email?.split('@')[0] || "user"}
              </p>
            </div>

            {isEditingBio ? (
              <input
                type="text"
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                onBlur={handleBioSave}
                onKeyDown={(e) => { if (e.key === 'Enter') handleBioSave() }}
                className="mt-4 max-w-xs w-full font-medium leading-relaxed text-center border-b-2 border-foreground bg-transparent focus:outline-none"
                autoFocus
              />
            ) : (
              <p 
                onClick={() => {
                  setTempBio(bio)
                  setIsEditingBio(true)
                }}
                className="mt-4 max-w-xs font-medium leading-relaxed text-muted-foreground italic cursor-pointer hover:text-foreground transition-colors"
                title="클릭하여 수정"
              >
                &quot;{bio}&quot;
              </p>
            )}
          </div>

          {/* 링크 목록 */}
          <div className="flex w-full flex-col gap-6">
            <AddLinkDialog onAdd={handleAddLink} />
            {linkList.map((link) => (
              <LinkItem key={link.id} link={link} userId={user.uid} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-md flex-col items-center justify-center p-12 border-4 border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] text-center gap-8 mt-4">
          <div className="text-6xl animate-bounce">👋</div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase text-foreground break-keep">로그인이 필요합니다</h2>
            <p className="font-bold text-muted-foreground break-keep text-lg">
              마이링크를 사용하여 나만의 멀티 링크 페이지를 만들어보세요.
            </p>
          </div>
          <Button
            onClick={handleLogin}
            className="w-full py-8 text-xl border-4 border-foreground bg-primary text-foreground hover:bg-primary/90 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
          >
            구글 계정으로 시작하기
          </Button>
        </div>
      )}

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
