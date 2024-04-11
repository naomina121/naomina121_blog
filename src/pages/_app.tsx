import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import * as gtag from '../lib/gtag'
import Loader from '@/components/Loder'
import { ConfirmProvider } from '@/context/confirm-provider'

export default function App({ session, Component, pageProps }: any & AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouterChange = (url: any) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouterChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouterChange)
    }
  }, [router.events])
  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
      />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());

           gtag('config', '${gtag.GA_MEASUREMENT_ID}');
           `,
        }}
      />
      <Loader />
      <ToastContainer />
      <ConfirmProvider>
        <Component {...pageProps} />
      </ConfirmProvider>
    </>
  )
}
