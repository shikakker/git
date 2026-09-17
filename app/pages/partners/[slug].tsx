import { marked } from 'marked'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IconChevronLeft, IconExternalLink } from '~/components/Icons'
import Layout from '~/components/Layout'
import SectionContainer from '~/components/SectionContainer'
import supabase from '~/lib/supabase'
import { Partner } from '~/types/partners'
import Error404 from '../404'

function safeExternalUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

function PartnerPage({ partner }: { partner: Partner }) {
  if (!partner) return <Error404 />

  const websiteUrl = safeExternalUrl(partner.website)
  const docsUrl = safeExternalUrl(partner.docs)

  return (
    <>
      <Head>
        <title>{partner.title} | Supabase Partner Gallery Example</title>
        <meta name="description" content={partner.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <SectionContainer>
          <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2">
            <Link
              href={`/partners/${partner.type === 'technology' ? 'integrations' : 'experts'}`}
              className="flex min-h-[44px] w-fit cursor-pointer items-center gap-1 text-scale-1200 transition-colors hover:text-scale-1000 focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <IconChevronLeft aria-hidden="true" />
              Back
            </Link>

            <div className="flex items-center space-x-4">
              <Image
                width={56}
                height={56}
                className="h-14 w-14 flex-shrink-0 rounded-full bg-scale-400 object-contain"
                src={partner.logo}
                alt={`${partner.title} logo`}
              />
              <h1 className="h1" style={{ marginBottom: 0 }}>{partner.title}</h1>
            </div>

            {partner.images?.length ? (
              <div
                className="bg-scale-300 py-6"
                style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
              >
                <Swiper
                  initialSlide={0}
                  spaceBetween={0}
                  slidesPerView={1}
                  speed={300}
                  centerInsufficientSlides
                  breakpoints={{
                    720: { slidesPerView: 2 },
                    920: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1208: { slidesPerView: 5 },
                  }}
                >
                  {partner.images.map((image: string, index: number) => (
                    <SwiperSlide key={`${image}-${index}`}>
                      <div className="relative mx-3 block overflow-hidden rounded-md">
                        <Image
                          width={1460}
                          height={960}
                          src={image}
                          alt={`${partner.title} screenshot ${index + 1}`}
                          className="h-auto w-full object-contain"
                          sizes="(max-width: 719px) 100vw, (max-width: 919px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : null}

            <div className="grid gap-3 space-y-16 lg:grid-cols-4 lg:space-y-0">
              <div className="lg:col-span-3">
                <h2 className="mb-4 text-2xl text-scale-1200">Overview</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: partner.overview }} />
              </div>

              <aside>
                <h2 className="mb-4 text-2xl text-scale-1200">Details</h2>
                <dl className="divide-y text-scale-1200">
                  <div className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-scale-900">Developer</dt>
                    <dd className="text-right text-scale-1200">{partner.developer}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-scale-900">Category</dt>
                    <dd>
                      <Link
                        href={`/partners/${partner.type === 'technology' ? 'integrations' : 'experts'}#${partner.category.toLowerCase()}`}
                        className="text-brand-900 transition-colors hover:text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
                      >
                        {partner.category}
                      </Link>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-scale-900">Website</dt>
                    <dd>
                      {websiteUrl ? (
                        <a href={websiteUrl} target="_blank" rel="noreferrer" className="text-brand-900 transition-colors hover:text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-600">
                          {new URL(websiteUrl).host}
                        </a>
                      ) : (
                        <span className="text-scale-900">Unavailable</span>
                      )}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-scale-900">Documentation</dt>
                    <dd>
                      {docsUrl ? (
                        <a href={docsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-900 transition-colors hover:text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-600">
                          Learn
                          <IconExternalLink size={16} aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="text-scale-900">Unavailable</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (!supabase) {
    return { paths: [], fallback: 'blocking' }
  }

  const { data: slugs } = await supabase.from<Partner>('partners').select('slug')

  return {
    paths: slugs?.map(({ slug }) => ({ params: { slug } })) ?? [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!supabase) {
    return { notFound: true }
  }

  const { data: partner } = await supabase
    .from<Partner>('partners')
    .select('*')
    .eq('slug', params?.slug as string)
    .single()

  if (!partner) return { notFound: true }

  partner.overview = marked.parse(partner.overview)

  return {
    props: { partner },
    revalidate: 18000,
  }
}

export default PartnerPage
