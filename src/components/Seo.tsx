import Head from 'next/head'
import { FC } from 'react'
import { siteConfig } from '../../site.config'

interface MetaData {
  pageTitle?: string
  pageDescription?: string
  pagePath?: string
  pageImg?: string
  pageImgWidth?: number
  pageImgHeight?: number
}

const Seo: FC<MetaData> = ({
  pageTitle,
  pageDescription,
  pagePath,
  pageImg,
  pageImgWidth,
  pageImgHeight,
}) => {
  const defaultTitle = siteConfig.siteTitle
  const defaultDescription = siteConfig.description

  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle
  const description = pageDescription ? pageDescription : defaultDescription
  const url = pagePath
  const imgUrl = pageImg? pageImg : `${siteConfig.siteUrl}ogp.jpg`
  const imgWidth = pageImgWidth ? pageImgWidth : 1280
  const imgHeight = pageImgHeight ? pageImgHeight : 640

  return (
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='width=device-width,initial-scale=1.0' />
      <meta name='description' content={description} />
      <meta name="thumbnail" content={imgUrl} />
      <meta property='og:url' content={url} />
      <meta property='og:title' content={title} />
      <meta property='og:site_name' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content={imgUrl} />
      <meta property='og:image:width' content={String(imgWidth)} />
      <meta property='og:image:height' content={String(imgHeight)} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name="twitter:image" content={imgUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel='preconnect' href='https://fonts.gstatic.com' />
      <link rel='canonical' href={url} />
    </Head>
  )
}

export default Seo
