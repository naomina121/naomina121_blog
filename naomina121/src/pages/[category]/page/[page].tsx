import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import List from '@/components/List'
import Pagination from '@/components/Pagination/Pagination'
import { CategoryProps, NewsProps, Params } from '@/types'
import { jscategory, postCategory, postTitle, publishedAt, slug } from '@/utils/data'
import dateToTime from '@/utils/date'
import { allFetchPages,  getNumberOfPages, getPostsByPage } from '@/utils/notion'

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { category, page } = ctx.params as Params
  const { results } = await allFetchPages({ category: category })
  const postsByPage = await getPostsByPage({
    pageNumber: parseInt(page.toString(), 10),
    allPosts: results,
  })
  const numberOfPage = await getNumberOfPages(results)

  if (!postsByPage.length) {
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

export const getStaticPaths: GetStaticPaths = async (ctx: any) => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const CategoryPage: NextPage<CategoryProps> = ({ pages, category, numberOfPage, page }) => {

  return (
    <Layout>
      <>
        <h1 className='font-black text-2xl mt-6 mb-4'>{jscategory(pages[0])}</h1>
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

export default CategoryPage
