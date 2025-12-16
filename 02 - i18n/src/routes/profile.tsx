import { createFileRoute } from '@tanstack/react-router'
import { useLocaleTranslation } from '@/hooks/useLocaleTranslation'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { t } = useLocaleTranslation()

  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <button>{t('profile.edit')}</button>
    </div>
  )
}
