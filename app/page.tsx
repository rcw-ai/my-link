"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { type Link as LinkType } from "@/data/links"
import { AddLinkDialog } from "@/components/AddLinkDialog"
import { LinkItem } from "@/components/LinkItem"
import { LandingView } from "@/components/LandingView"
import { auth, db, googleProvider } from "@/lib/firebase"
import { collection, addDoc, query, orderBy, serverTimestamp, doc, getDoc, setDoc, where, getDocs } from "firebase/firestore"
import { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, User, signInWithPopup } from "firebase/auth"
import { RiFileCopyLine, RiCheckLine, RiLogoutBoxLine, RiExternalLinkLine, RiBarChartBoxLine } from "@remixicon/react"
import Link from "next/link"

export default function Page() {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // 인라인 편집 상태
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [tempUsername, setTempUsername] = useState("")

  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
  const [tempDisplayName, setTempDisplayName] = useState("")
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [displayNameError, setDisplayNameError] = useState("")

  const [isEditingBio, setIsEditingBio] = useState(false)
  const [tempBio, setTempBio] = useState("")

  // 고유한 displayName 생성 함수
  const generateUniqueDisplayName = async (baseName: string): Promise<string> => {
    let cleanName = baseName.replace(/[^a-zA-Z0-9가-힣_]/g, "");
    if (!cleanName) cleanName = "user";
    
    let isUnique = false;
    let candidate = cleanName;
    let attempt = 0;
    
    while (!isUnique) {
      const q = query(collection(db, "users"), where("displayName", "==", candidate));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        isUnique = true;
      } else {
        attempt++;
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        candidate = `${cleanName}${randomNum}`;
      }
      if (attempt > 10) {
        candidate = `${cleanName}${Date.now().toString().slice(-4)}`;
        break;
      }
    }
    return candidate;
  }

  useEffect(() => {
    // 리다이렉트 로그인 후 복귀 시 발생한 에러 핸들링
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect login error:", error)
    })

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthInitialized(true)
    })
    return () => unsubscribeAuth()
  }, [])

  // Profile Query
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      if (!user) return null
      const userDocRef = doc(db, "users", user.uid)
      const userDocSnapshot = await getDoc(userDocRef)
      
      if (userDocSnapshot.exists()) {
        const data = userDocSnapshot.data()
        return {
          username: data.username || user.displayName || "User",
          displayName: data.displayName || user.email?.split('@')[0] || "user",
          bio: data.bio || "한줄 소개를 입력해주세요"
        }
      } else {
        // 최초 가입 시
        const baseName = user.email?.split('@')[0] || "user"
        const uniqueName = await generateUniqueDisplayName(baseName)
        const initialUsername = user.displayName || "User"
        const initialBio = "한줄 소개를 입력해주세요"
        
        await setDoc(userDocRef, {
          username: initialUsername,
          displayName: uniqueName,
          bio: initialBio,
          createdAt: serverTimestamp()
        })
        
        return {
          username: initialUsername,
          displayName: uniqueName,
          bio: initialBio
        }
      }
    },
    enabled: !!user,
  })

  // Links Query
  const { data: linkList = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["links", user?.uid],
    queryFn: async () => {
      if (!user) return []
      const q = query(collection(db, `users/${user.uid}/links`), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as LinkType[]
    },
    enabled: !!user,
  })

  // Profile Update Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username?: string; displayName?: string; bio?: string }) => {
      if (!user) throw new Error("No user")
      await setDoc(doc(db, "users", user.uid), data, { merge: true })
    },
    onMutate: async (newData) => {
      // 진행 중인 리페치를 취소하여 낙관적 캐시가 덮어씌워지지 않게 방지
      await queryClient.cancelQueries({ queryKey: ["profile", user?.uid] })
      // 에러 시 롤백을 위해 이전 데이터 저장
      const previousProfile = queryClient.getQueryData(["profile", user?.uid])
      // 캐시를 새로운 값으로 즉시 업데이트
      if (previousProfile) {
        queryClient.setQueryData(["profile", user?.uid], {
          ...(previousProfile as Record<string, unknown>),
          ...newData
        })
      }
      return { previousProfile }
    },
    onError: (err, newData, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile", user?.uid], context.previousProfile)
      }
    },
    onSettled: () => {
      // 백그라운드 갱신을 통해 항상 서버와 동일한 최신 상태 유지
      queryClient.invalidateQueries({ queryKey: ["profile", user?.uid] })
    }
  })

  // Add Link Mutation
  const addLinkMutation = useMutation({
    mutationFn: async (newLink: LinkType) => {
      if (!user) throw new Error("No user")
      await addDoc(collection(db, `users/${user.uid}/links`), {
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon || "external-link",
        createdAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.uid] })
    }
  })

  // 닉네임 실시간 중복 검사 (디바운스 300ms)
  useEffect(() => {
    if (!isEditingDisplayName || tempDisplayName === profile?.displayName) {
      setIsDuplicate(false);
      setDisplayNameError("");
      return;
    }

    const regex = /^[a-zA-Z0-9가-힣_]+$/;
    if (!tempDisplayName) {
      setDisplayNameError("닉네임을 입력해주세요.");
      setIsDuplicate(true);
      return;
    }
    if (!regex.test(tempDisplayName)) {
      setDisplayNameError("한글, 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.");
      setIsDuplicate(true);
      return;
    }

    setDisplayNameError("");
    setIsCheckingDuplicate(true);

    const checkDuplicate = async () => {
      try {
        const q = query(collection(db, "users"), where("displayName", "==", tempDisplayName));
        const snapshot = await getDocs(q);
        
        let dup = false;
        snapshot.forEach((doc) => {
          if (doc.id !== user?.uid) {
            dup = true;
          }
        });

        setIsDuplicate(dup);
        if (dup) {
          setDisplayNameError("이미 사용 중인 닉네임입니다.");
        } else {
          setDisplayNameError("");
        }
      } catch (error) {
        console.error("Error checking duplicate:", error);
      } finally {
        setIsCheckingDuplicate(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      checkDuplicate();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [tempDisplayName, isEditingDisplayName, profile?.displayName, user]);

  const handleLogin = async () => {
    try {
      // 모바일 기기(인앱 브라우저 등)에서는 팝업 차단을 피하기 위해 리다이렉트 사용, PC/개발환경에서는 팝업 사용
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider)
      } else {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      queryClient.clear()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleCopyLink = () => {
    if (!profile) return
    navigator.clipboard.writeText(`${window.location.origin}/${profile.displayName}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUsernameSave = async () => {
    setIsEditingUsername(false)
    const trimmed = tempUsername.trim()
    if (trimmed && trimmed !== profile?.username) {
      updateProfileMutation.mutate({ username: trimmed })
    }
  }

  const handleDisplayNameSave = async () => {
    if (isDuplicate || displayNameError || isCheckingDuplicate) return;
    
    setIsEditingDisplayName(false)
    const trimmed = tempDisplayName.trim()
    if (trimmed && trimmed !== profile?.displayName) {
      updateProfileMutation.mutate({ displayName: trimmed })
    }
  }

  const handleBioSave = async () => {
    setIsEditingBio(false)
    if (tempBio !== profile?.bio) {
      updateProfileMutation.mutate({ bio: tempBio })
    }
  }

  if (!authInitialized || (user && isProfileLoading)) {
    return <div className="flex min-h-svh items-center justify-center font-bold text-xl uppercase">Loading...</div>
  }

  if (!user) {
    return <LandingView onLogin={handleLogin} />
  }

  const username = profile?.username || "User"
  const displayName = profile?.displayName || "user"
  const bio = profile?.bio || "한줄 소개를 입력해주세요"

  return (
    <div className="flex min-h-svh flex-col items-center px-6 py-16 selection:bg-primary selection:text-primary-foreground">
      {/* 헤더 */}
      <header className="w-full max-w-md flex justify-between items-center mb-12">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter text-foreground bg-primary px-3 py-1 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] dark:hover:shadow-none">
          MyLink
        </Link>
        <div className="relative group">
          <div className="h-10 w-10 border-2 border-foreground bg-background overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all flex items-center justify-center">
            <span className="font-black text-sm text-foreground">
              {username.substring(0, 2).toUpperCase() || "ML"}
            </span>
          </div>
          
          <div className="absolute right-0 mt-2 w-48 border-4 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 origin-top-right">
            <Link 
              href={`/${displayName}`}
              className="flex items-center gap-2 px-4 py-3 text-left font-bold uppercase border-b-2 border-foreground hover:bg-secondary text-foreground transition-colors"
            >
              <RiExternalLinkLine size={18} />
              내 페이지 보기
            </Link>
            <Link
              href="/stats"
              className="flex items-center gap-2 px-4 py-3 text-left font-bold uppercase border-b-2 border-foreground hover:bg-secondary text-foreground transition-colors"
            >
              <RiBarChartBoxLine size={18} />
              링크 통계
            </Link>
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
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* 프로필 섹션 */}
        <div className="mb-12 flex flex-col items-center text-center w-full">
          <div className="relative mb-6">
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-foreground" />
            <div className="relative border-4 border-foreground bg-primary p-1">
              <div className="h-24 w-24 bg-background flex items-center justify-center border-2 border-foreground overflow-hidden">
                <span className="text-4xl font-black text-foreground">{username.substring(0, 2).toUpperCase() || "ML"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            {isEditingUsername ? (
              <div className="flex flex-col items-center w-full max-w-xs">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onBlur={handleUsernameSave}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleUsernameSave() }}
                  className="text-2xl font-black text-center border-4 border-foreground bg-background px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] focus:outline-none w-full"
                  autoFocus
                />
                <span className="text-[10px] text-muted-foreground mt-1 font-bold">실명을 입력하고 Enter를 누르세요.</span>
              </div>
            ) : (
              <h1 
                onClick={() => {
                  setTempUsername(username)
                  setIsEditingUsername(true)
                }}
                className="text-3xl font-black uppercase tracking-tighter text-foreground bg-accent px-4 py-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] cursor-pointer hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all"
                title="클릭하여 수정"
              >
                {username}
              </h1>
            )}

            {isEditingDisplayName ? (
              <div className="flex flex-col items-center w-full max-w-xs">
                <div className="relative w-full flex items-center">
                  <span className="absolute left-3 text-lg font-black text-foreground">@</span>
                  <input
                    type="text"
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    onBlur={handleDisplayNameSave}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDisplayNameSave() }}
                    className="pl-8 pr-4 py-2 w-full font-bold text-lg text-center border-4 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] focus:outline-none"
                    autoFocus
                  />
                </div>
                
                {isCheckingDuplicate && (
                  <span className="text-xs text-blue-500 font-bold mt-2">중복 확인 중...</span>
                )}
                {!isCheckingDuplicate && displayNameError && (
                  <span className="text-xs text-destructive font-bold mt-2">{displayNameError}</span>
                )}
                {!isCheckingDuplicate && !displayNameError && tempDisplayName && tempDisplayName !== displayName && (
                  <span className="text-xs text-emerald-500 font-bold mt-2">사용 가능한 닉네임입니다.</span>
                )}
                <span className="text-[10px] text-muted-foreground mt-1">닉네임은 고유한 공유 URL로 사용됩니다.</span>
              </div>
            ) : (
              <p 
                onClick={() => {
                  setTempDisplayName(displayName)
                  setIsEditingDisplayName(true)
                }}
                className="font-bold text-lg text-foreground px-2 cursor-pointer hover:text-primary transition-colors"
                title="클릭하여 수정"
              >
                @{displayName}
              </p>
            )}
          </div>

          {isEditingBio ? (
            <input
              type="text"
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              onBlur={handleBioSave}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBioSave() }}
              className="mt-6 max-w-xs w-full font-medium leading-relaxed text-center border-b-2 border-foreground bg-transparent focus:outline-none"
              autoFocus
            />
          ) : (
            <p 
              onClick={() => {
                setTempBio(bio)
                setIsEditingBio(true)
              }}
              className="mt-6 max-w-xs font-medium leading-relaxed text-muted-foreground italic cursor-pointer hover:text-foreground transition-colors"
              title="클릭하여 수정"
            >
              &quot;{bio}&quot;
            </p>
          )}
        </div>

        {/* 링크 목록 */}
        <div className="flex w-full flex-col gap-6">
          <AddLinkDialog onAdd={(link) => addLinkMutation.mutate(link)} />
          {isLinksLoading ? (
            <div className="text-center font-bold text-muted-foreground">링크 로딩 중...</div>
          ) : linkList.map((link) => (
            <LinkItem key={link.id} link={link} userId={user.uid} />
          ))}
        </div>
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
