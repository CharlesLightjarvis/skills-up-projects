import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { usePosts } from '@/hooks/use-posts'
import { CreatePostForm } from '@/routes/_protected/posts/-components/posts/CreatePostForm'
import { PostCard } from '@/routes/_protected/posts/-components/posts/PostCard'
import { Loader2 } from 'lucide-react'
import echo from '@/lib/echo'
import type { Post } from '@/types/post'

export const Route = createFileRoute('/_protected/posts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    updatePostViaSocket,
    deletePostViaSocket,
  } = usePosts()

  // useEffect(() => {
  //   fetchPosts()

  //   if (!echo) return

  //   const channel = echo.channel('posts')

  //   channel.listen('PostCreated', (event: { post: Post }) => {
  //     console.log('Nouveau post reçu:', event.post)
  //     addPost(event.post)
  //   })

  //   channel.listen('PostUpdated', (event: { post: Post }) => {
  //     console.log('Post mis à jour reçu:', event.post)
  //     updatePostViaSocket(event.post)
  //   })

  //   return () => {
  //     channel.stopListening('PostCreated')
  //     channel.stopListening('PostUpdated')
  //     echo?.leaveChannel('posts')
  //   }
  // }, [echo])

  useEffect(() => {
    fetchPosts()

    if (!echo) return

    const safeEcho = echo
    const channel = safeEcho.channel('posts')

    channel.listenToAll((eventName: string, event: { post: Post }) => {
      if (eventName === 'PostCreated') {
        console.log('Post créé:', event.post)
        addPost(event.post)
      }

      if (eventName === 'PostUpdated') {
        console.log('Post mis à jour:', event.post)
        updatePostViaSocket(event.post)
      }

      if (eventName === 'PostDeleted') {
        console.log('Post supprimé:', event.post)
        deletePostViaSocket(event.post.id)
      }
    })

    return () => {
      channel.stopListeningToAll()
      safeEcho.leaveChannel('posts')
    }
  }, [echo])

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Formulaire de création en haut */}
        <CreatePostForm />

        {/* Liste des posts en bas */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Fil d'actualité</h2>

          {loading && posts.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!loading && posts.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun post pour le moment. Soyez le premier à publier !
              </p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
