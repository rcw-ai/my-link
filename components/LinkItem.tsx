"use client"

import { useState, ElementType } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { type Link } from "@/data/links"
import { db } from "@/lib/firebase"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { 
  RiInstagramLine, 
  RiYoutubeLine, 
  RiRssLine, 
  RiGithubLine, 
  RiBriefcaseLine, 
  RiExternalLinkLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiCloseLine
} from "@remixicon/react"

const iconMap: Record<string, ElementType> = {
  instagram: RiInstagramLine,
  youtube: RiYoutubeLine,
  rss: RiRssLine,
  github: RiGithubLine,
  briefcase: RiBriefcaseLine,
}

const formSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요." }),
  url: z.string().url({ message: "올바른 URL 형식이 아닙니다. (예: https://example.com)" }),
})

type FormValues = z.infer<typeof formSchema>

interface LinkItemProps {
  link: Link
  userId: string
}

export function LinkItem({ link, userId }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const Icon = iconMap[link.icon || ""] || RiExternalLinkLine

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  })

  const handleUpdate = async (values: FormValues) => {
    try {
      const docRef = doc(db, `users/${userId}/links`, link.id)
      await updateDoc(docRef, {
        title: values.title,
        url: values.url,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating link: ", error)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const docRef = doc(db, `users/${userId}/links`, link.id)
      await deleteDoc(docRef)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting link: ", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelEdit = () => {
    form.reset({ title: link.title, url: link.url })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card className="relative border-4 border-foreground bg-background p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)} className="grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="제목 (예: 내 블로그)"
                      className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:translate-x-0.5 focus-visible:translate-y-0.5 focus-visible:shadow-none transition-all font-bold"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-bold text-xs bg-destructive/10 p-1 border-2 border-destructive max-w-full break-words" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      type="url"
                      {...field}
                      placeholder="URL (https://example.com)"
                      className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:translate-x-0.5 focus-visible:translate-y-0.5 focus-visible:shadow-none transition-all font-bold"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-bold text-xs bg-destructive/10 p-1 border-2 border-destructive max-w-full break-words" />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancelEdit}
                className="border-2 border-foreground rounded-none font-bold uppercase hover:bg-secondary flex-1"
              >
                <RiCloseLine className="mr-1" size={18} />
                취소
              </Button>
              <Button 
                type="submit"
                className="border-2 border-foreground bg-primary text-foreground rounded-none font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all flex-1"
              >
                <RiCheckLine className="mr-1" size={18} />
                저장
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    )
  }

  return (
    <>
      <div className="group relative flex w-full gap-2">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex-1"
        >
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-foreground transition-transform group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-0 group-active:translate-y-0" />
          
          <Card className="relative h-full border-4 border-foreground bg-background transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-0 group-active:translate-y-0">
            <CardContent className="flex items-center justify-between p-5 h-full">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-foreground bg-secondary text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-black uppercase tracking-tight break-all line-clamp-2">{link.title}</span>
              </div>
              <RiExternalLinkLine size={20} className="text-foreground shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-2" />
            </CardContent>
          </Card>
        </a>

        {/* 수정 및 삭제 버튼 컨테이너 */}
        <div className="flex flex-col gap-2 shrink-0 w-12">
          <Button
            size="icon"
            onClick={() => setIsEditing(true)}
            className="flex-1 border-4 border-foreground bg-background hover:bg-accent text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all rounded-none"
            title="수정"
          >
            <RiPencilLine size={18} />
          </Button>
          <Button
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex-1 border-4 border-foreground bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all rounded-none"
            title="삭제"
          >
            <RiDeleteBinLine size={18} />
          </Button>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-4 border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:max-w-[425px] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase text-foreground">정말 삭제하시겠습니까?</DialogTitle>
            <div className="mt-4 p-4 border-2 border-foreground bg-muted font-bold text-lg text-center break-all">
              {link.title}
            </div>
            <p className="mt-4 text-destructive font-black text-center border-2 border-destructive bg-destructive/10 p-2">
              이 작업은 되돌릴 수 없습니다
            </p>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 mt-4 flex-row">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-2 border-foreground rounded-none font-bold uppercase hover:bg-secondary flex-1">
                취소
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
              className="border-2 border-foreground rounded-none font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all flex-1"
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
