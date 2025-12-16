// src/hooks/useLocaleTranslation.ts
import { useTranslation } from 'react-i18next'

export function useLocaleTranslation() {
  const { t, i18n } = useTranslation()

  return {
    t,
    currentLang: i18n.language,
    changeLanguage: i18n.changeLanguage,
    languages: ['en', 'fr'], // tes langues supportées
  }
}
