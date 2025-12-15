import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePosts } from '@/hooks/use-posts'
import { toast } from 'sonner'
import type { CreatePostData } from '@/types/post'

const postSchema = z.object({
  content: z.string().min(1, 'Le contenu est requis').max(255, 'Le contenu est trop long (max 255 caractères)'),
})

type PostFormData = z.infer<typeof postSchema>

export function CreatePostForm() {
  const { createPost, loading } = usePosts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true)
    try {
      const result = await createPost(data as CreatePostData)
      if (result.success) {
        toast.success(result.message || 'Post créé avec succès')
        form.reset()
      } else {
        toast.error(result.message || 'Erreur lors de la création du post')
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer un nouveau post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qu'avez-vous en tête ?</FormLabel>
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

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Publication...' : 'Publier'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
