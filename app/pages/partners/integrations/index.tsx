import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'
import BecomeAPartner from '~/components/BecomeAPartner'
import { IconLoader, IconSearch } from '~/components/Icons'
import Layout from '~/components/Layout'
import PartnerLinkBox from '~/components/PartnerLinkBox'
import PartnerTileGrid from '~/components/PartnerTileGrid'
import SectionContainer from '~/components/SectionContainer'
import supabase from '~/lib/supabase'
import { Partner } from '~/types/partners'

export async function getStaticProps() {
  const { data: partners } = await supabase
    .from<Partner>('partners')
    .select('*')
    .eq('approved', true)
    .eq('type', 'technology')
    .order('category')
    .order('title')

  return {
    props: {
      partners: partners ?? [],
    },
    revalidate: 18000,
  }
}

interface Props {
  partners: Partner[]
}

function IntegrationPartnersPage({ partners: initialPartners }: Props) {
  const [partners, setPartners] = useState(initialPartners)
  const [search, setSearch] = useState('')
  const [debouncedSearchTerm] = useDebounce(search, 300)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const router = useRouter()

  const allCategories = useMemo(
    () => Array.from(new Set(initialPartners.map((partner) => partner.category))),
    [initialPartners]
  )

  const partnersByCategory = useMemo(() => {
    const grouped: { [category: string]: Partner[] } = {}
    partners.forEach((partner) => {
      grouped[partner.category] = [...(grouped[partner.category] ?? []), partner]
    })
    return grouped
  }, [partners])

  const metaTitle = 'Find an Integration'
  const metaDescription = 'Use your favorite tools with Supabase.'

  useEffect(() => {
    let cancelled = false
    const term = debouncedSearchTerm.trim()

    if (!term) {
      setPartners(initialPartners)
      setSearchError('')
      setIsSearching(false)
      return () => {
        cancelled = true
      }
    }

    const searchPartners = async () => {
      setIsSearching(true)
      setSearchError('')

      const { data, error } = await supabase
        .from<Partner>('partners')
        .select('*')
        .eq('approved', true)
        .eq('type', 'technology')
        .textSearch('tsv', term, {
          type: 'websearch',
          config: 'english',
        })
        .order('category')
        .order('title')

      if (cancelled) return

      if (error) {
        setSearchError('Search is temporarily unavailable. Please try again.')
      } else {
        setPartners(data ?? [])
      }
      setIsSearching(false)
    }

    void searchPartners()
    return () => {
      cancelled = true
    }
  }, [debouncedSearchTerm, initialPartners])

  return (
    <>
      <Head>
        <title>{metaTitle} | Supabase Partner Gallery Example</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SectionContainer className="space-y-16">
          <div>
            <h1 className="h1">{metaTitle}</h1>
            <h2 className="text-xl text-scale-900">{metaDescription}</h2>
          </div>

          <div className="grid space-y-12 md:gap-8 lg:grid-cols-12 lg:gap-16 lg:space-y-0 xl:gap-16">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="space-y-6">
                <div>
                  <label htmlFor="partner-search" className="sr-only">Search integrations</label>
                  <div className="relative">
                    <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-scale-900" aria-hidden="true" />
                    <input
                      id="partner-search"
                      type="search"
                      placeholder="Search integrations"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="min-h-[44px] w-full rounded-md border border-scale-500 bg-scale-100 py-2 pl-10 pr-10 text-scale-1200 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30"
                    />
                    {isSearching && (
                      <IconLoader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-scale-900" aria-label="Searching" />
                    )}
                  </div>
                  {searchError && <p className="mt-2 text-sm text-red-600" role="alert">{searchError}</p>}
                </div>

                <div className="hidden lg:block">
                  <div className="mb-2 text-sm text-scale-900">Categories</div>
                  <div className="space-y-1">
                    {allCategories.map((category) => (
                      <button
                        type="button"
                        key={category}
                        onClick={() => void router.push(`#${category.toLowerCase()}`)}
                        className="block min-h-[36px] text-left text-base text-scale-1100 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="mb-2 text-sm text-scale-900">Explore more</div>
                  <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
                    <PartnerLinkBox
                      title="Experts"
                      color="blue"
                      description="Explore certified Supabase agency experts that build with Supabase"
                      href="/partners/experts"
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                    <PartnerLinkBox
                      href="/partners/integrations#become-a-partner"
                      title="Become a partner"
                      color="brand"
                      description="Fill out a quick form to apply to become a partner"
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9">
              <div className="grid space-y-10" aria-live="polite" aria-busy={isSearching}>
                {partners.length ? (
                  <PartnerTileGrid partnersByCategory={partnersByCategory} />
                ) : (
                  <h2 className="h2">No Partners Found</h2>
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
        <BecomeAPartner />
      </Layout>
    </>
  )
}

export default IntegrationPartnersPage
