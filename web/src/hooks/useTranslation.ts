import { useAppSelector } from './redux'

export const useTranslation = () => {
  const { currentLanguage, translations } = useAppSelector((state) => state.language)
  
  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || key
  }
  
  return { t, currentLanguage }
}