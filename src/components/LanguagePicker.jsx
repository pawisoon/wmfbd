import { useLocale } from '../i18n/LocaleContext'
import { LOCALES } from '../i18n/translations'

export function LanguagePicker() {
  const { locale, changeLocale } = useLocale()

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLocale(code)}
          className={`px-2 py-1 text-xs font-medium rounded-md transition-colors
            ${locale === code
              ? 'text-white bg-white/15'
              : 'text-gray-600 hover:text-gray-400'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
