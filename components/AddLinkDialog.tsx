"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/data/links"
import { RiAddLine } from "@remixicon/react"

const formSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요." }),
  url: z.string().url({ message: "올바른 URL 형식이 아닙니다. (예: https://example.com)" }),
})

type FormValues = z.infer<typeof formSchema>

interface AddLinkDialogProps {
  onAdd: (link: Link) => void
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    const newLink: Link = {
      id: Date.now().toString(),
      title: values.title,
      url: values.url,
      icon: "external-link"
    }

    onAdd(newLink)
    setOpen(false)
    form.reset()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full max-w-md gap-2 border-4 border-foreground bg-primary py-6 text-lg font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] dark:hover:shadow-none text-foreground mb-4">
          <RiAddLine size={24} />
          <span>Add New Link</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-4 border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:max-w-[425px] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase text-foreground">새 링크 추가</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel className="text-sm font-bold uppercase text-foreground">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="예: 내 블로그"
                      className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:translate-x-0.5 focus-visible:translate-y-0.5 focus-visible:shadow-none transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-bold text-sm bg-destructive/10 p-2 border-2 border-destructive max-w-full break-words" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel className="text-sm font-bold uppercase text-foreground">URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      {...field}
                      placeholder="https://example.com"
                      className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:translate-x-0.5 focus-visible:translate-y-0.5 focus-visible:shadow-none transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-bold text-sm bg-destructive/10 p-2 border-2 border-destructive max-w-full break-words" />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-end gap-2 mt-4 flex-row">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-2 border-foreground rounded-none font-bold uppercase hover:bg-secondary flex-1">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit" className="border-2 border-foreground bg-primary text-foreground rounded-none font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all flex-1">
                추가하기
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
