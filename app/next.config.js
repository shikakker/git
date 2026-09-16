const supabaseHostname = process.env.SUPABASE_HOSTNAME?.trim()

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: supabaseHostname ? {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
      },
    ],
  } : {},
  async redirects() {
    return [
      {
        permanent: false,
        source: '/',
        destination: '/partners/integrations',
      },
      {
        permanent: false,
        source: '/partners',
        destination: '/partners/integrations',
      },
    ]
  },
}
