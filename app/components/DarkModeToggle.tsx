import { IconMoon, IconSun } from '~/components/Icons'
import { useTheme } from '~/lib/theme'

function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  const toggleDarkMode = () => {
    localStorage.setItem('supabaseDarkMode', (!isDarkMode).toString())
    toggleTheme()

    const key = localStorage.getItem('supabaseDarkMode')
    document.documentElement.className = key === 'true' ? 'dark' : ''
  }

  return (
    <div className="flex items-center">
      <IconSun className="text-scale-900" strokeWidth={2} aria-hidden="true" />
      <button
        type="button"
        aria-pressed={isDarkMode}
        aria-label="Toggle dark mode"
        className={`relative mx-5 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 ${
          isDarkMode ? 'bg-scale-500' : 'bg-scale-900'
        }`}
        onClick={toggleDarkMode}
      >
        <span
          aria-hidden="true"
          className={`${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          } inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-scale-300`}
        />
      </button>
      <IconMoon className="text-scale-900" strokeWidth={2} aria-hidden="true" />
    </div>
  )
}

export default DarkModeToggle
