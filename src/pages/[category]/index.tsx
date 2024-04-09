import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { siteConfig } from '../../../site.config'
import Breadcrumb from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import List from '@/components/List'
import Pagination from '@/components/Pagination/Pagination'
import Seo from '@/components/Seo'
import { CategoryProps, NewsProps, Params } from '@/types'
import { jscategory, postCategory, postTitle, publishedAt, slug } from '@/utils/data'
import dateToTime from '@/utils/date'
import { allFetchPages, getNumberOfPages, getPostsByPage } from '@/utils/notion'

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { category } = ctx.params as Params
  const { results } = await allFetchPages({ category: category })
  const page = 1
  const postsByPage = await getPostsByPage({
    pageNumber: parseInt(page.toString(), 10),
    allPosts: results,
  })
  const numberOfPage = await getNumberOfPages(results)

  if (!results.length) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      pages: postsByPage ? postsByPage : [],
      category: category,
      numberOfPage: numberOfPage,
      page: page,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const Category: NextPage<CategoryProps> = ({ pages, category, numberOfPage, page }) => {
  return (
    <Layout>
      <>
        <Seo
          pageTitle={`${jscategory(pages[0])}の一覧`}
          pagePath={`${siteConfig.siteUrl}${postCategory(pages[0])}`}
          pageImg={`${siteConfig.siteUrl}ogp.jpg`}
          pageImgWidth={1200}
          pageImgHeight={800}
        />
        <h1 className='font-black text-2xl mt-6 ml-4 mb-4'>{jscategory(pages[0])}</h1>

        <Breadcrumb
          breadList={`${postCategory(pages[0])}`}
          breadListJs={`${jscategory(pages[0])}`}
        />
        <ul className='w-full'>
          {pages.map((page, index) => {
            return <List key={index} page={page} />
          })}
        </ul>
        <Pagination numberOfPage={numberOfPage} category={category} current={page} />
      </>
    </Layout>
  )
}

export default Category
