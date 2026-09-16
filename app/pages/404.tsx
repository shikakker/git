import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import { useTheme } from '~/lib/theme'

const Error404 = () => {
  const [show404, setShow404] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const timer = window.setTimeout(() => setShow404(true), 500)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <Layout hideHeader hideFooter>
      <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center">
        <div className="absolute top-0 mx-auto w-full max-w-7xl px-8 pt-6 sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between sm:h-10" aria-label="Home">
            <Link href="/" className="flex" aria-label="Go to partner gallery home">
              <Image
                src={
                  isDarkMode
                    ? '/images/supabase-logo-wordmark--dark.svg'
                    : '/images/supabase-logo-wordmark--light.svg'
                }
                alt="Supabase Logo"
                height={24}
                width={120}
              />
            </Link>
          </nav>
        </div>
        <div className="absolute" aria-hidden="true">
          <p
            className={`select-none opacity-[5%] filter transition duration-200 ${
              show404 ? 'blur-sm' : 'blur-none'
            }`}
            style={{ fontSize: '28rem' }}
          >
            404
          </p>
        </div>
        <div
          className={`flex flex-col items-center justify-center space-y-6 transition ${
            show404 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex w-[320px] flex-col items-center justify-center space-y-3 text-scale-1200">
            <h1 className="m-2 text-2xl">Looking for something? 🔍</h1>
            <p className="text-center text-sm">
              We couldn't find the page that you're looking for!
            </p>
          </div>
          <Link
            href="/"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
          >
            Head back
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default Error404
