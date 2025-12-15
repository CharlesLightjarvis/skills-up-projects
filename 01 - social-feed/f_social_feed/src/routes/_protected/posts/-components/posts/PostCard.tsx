import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Heart, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import type { Post } from '@/types/post'
import { formatDistanceToNow, cn } from '@/lib/utils'
import { usePosts } from '@/hooks/use-posts'
import { toast } from 'sonner'
import { EditPostDialog } from './EditPostDialog'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { deletePost, toggleLike } = usePosts()
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const userInitials = post.user
    ? `${post.user.first_name[0]}${post.user.last_name[0]}`.toUpperCase()
    : 'UN'

  const userName = post.user
    ? `${post.user.first_name} ${post.user.last_name}`
    : 'Unknown User'

  // const canEdit = post.policies?.can_update ?? false
  // const canDelete = post.policies?.can_delete ?? false

  const handleDelete = async () => {
    const result = await deletePost(post.id)
    if (result.success) {
      toast.success(result.message || 'Post supprimé avec succès')
    } else {
      toast.error(result.message || 'Erreur lors de la suppression')
    }
    setShowDeleteAlert(false)
  }

  const handleLike = async () => {
    setIsLiking(true)
    try {
      await toggleLike(post.id)
    } catch (error) {
      toast.error('Erreur lors du like')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at))}
              </p>
            </div>
          </div>

          {/* {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => setShowDeleteAlert(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        </CardContent>

        <CardFooter className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className="gap-2"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                post.is_liked && 'fill-red-500 text-red-500',
              )}
            />
            <span className={cn(post.is_liked && 'text-red-500 font-semibold')}>
              {post.likes_count || 0}
            </span>
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog de modification */}
      <EditPostDialog
        post={post}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Alert de suppression */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le post sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
