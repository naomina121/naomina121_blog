import { GetStaticPaths, GetStaticProps } from 'next'
import React, { FC } from 'react'
import { siteConfig } from '../../../site.config'
import Layout from '@/components/Layout'
import List from '@/components/List'
import Seo from '@/components/Seo'
import { Params, TagProps } from '@/types'
import { allFetchPages } from '@/utils/notion'

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { tag } = ctx.params as Params
  const { results } = await allFetchPages({ tag: tag })
  if (!results.length) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      pages: results ? results : [],
      tag: tag,
    },
    revalidate: 300,
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const tag: FC<TagProps> = ({ pages, tag }) => {
  return (
    <Layout>
      <>
        <Seo
          pageTitle={tag.toUpperCase()}
          pagePath={`${siteConfig.siteUrl}tag/${tag}`}
          pageImg={`${siteConfig.siteUrl}ogp.jpg`}
          pageImgWidth={1200}
          pageImgHeight={800}
        />
        <h1 className='font-black text-2xl mt-6 mb-4'>TAG:{tag.toUpperCase()}</h1>
        <ul className='w-full'>
          {pages.map((page, index) => {
            return <List key={index} page={page} />
          })}
        </ul>
      </>
    </Layout>
  )
}

export default tag
