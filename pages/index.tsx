import Head from 'next/head'
import dynamic from 'next/dynamic'

const SafeAppWrapper = dynamic(
  () => import('../components/SafeAppAdapter'),
  { ssr: false }
)

export default function Home() {
  // If we're in an iframe, assume we're loaded as a Safe App
  const isIframe = typeof top !== 'undefined' && window !== top

  return (
    <div>
      <Head>
        <title>Safe Copycat</title>
        <meta name="description" content="Deploy a Safe to the same address on another chain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {isIframe ? (
          <SafeAppWrapper />
        ) : (
          'This app needs to be loaded in a Safe'
        )}
      </main>

      <footer>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {}
  }
}
