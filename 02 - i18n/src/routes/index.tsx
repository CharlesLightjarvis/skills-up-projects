import { createFileRoute } from '@tanstack/react-router'
import { useLocaleTranslation } from '@/hooks/useLocaleTranslation'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t, changeLanguage, currentLang, languages } = useLocaleTranslation()

  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <p>{t('home.description')}</p>
      <p>Langue actuelle : {currentLang}</p>

      {/* Ou de manière dynamique : */}
      <div>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            disabled={currentLang === lang}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
