import { useState, useEffect } from 'react'
import i18n from '../i18n'

const LANG_KEY = 'user_language'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '中文（简体）' },
  { code: 'zh-TW', label: '中文（繁體）' },
  { code: 'id', label: 'Indonesia' },
]

export default function LanguageSelector() {
  const [current, setCurrent] = useState<string>(i18n.language || 'en')

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved) {
      i18n.changeLanguage(saved)
      setCurrent(saved)
    }
  }, [])

  const select = async (code: string) => {
    await i18n.changeLanguage(code)
    localStorage.setItem(LANG_KEY, code)
    setCurrent(code)
  }

  return (
    <div className="flex gap-2">
      {languages.map(l => (
        <button
          key={l.code}
          onClick={() => select(l.code)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            current === l.code
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
