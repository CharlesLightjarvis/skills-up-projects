import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { usePosts } from '@/hooks/use-posts'
import { toast } from 'sonner'
import type { Post, UpdatePostData } from '@/types/post'

const postSchema = z.object({
  content: z.string().min(1, 'Le contenu est requis').max(255, 'Le contenu est trop long (max 255 caractères)'),
})

type PostFormData = z.infer<typeof postSchema>

interface EditPostDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPostDialog({ post, open, onOpenChange }: EditPostDialogProps) {
  const { updatePost, loading } = usePosts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: post.content,
    },
  })

  useEffect(() => {
    form.reset({ content: post.content })
  }, [post, form])

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true)
    try {
      const result = await updatePost(post.id, data as UpdatePostData)
      if (result.success) {
        toast.success(result.message || 'Post modifié avec succès')
        onOpenChange(false)
      } else {
        toast.error(result.message || 'Erreur lors de la modification du post')
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof PostFormData, {
              type: 'server',
              message: messages.join(', '),
            })
          })
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Partagez vos idées..."
                      className="min-h-[120px] resize-none"
                      {...field}
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
