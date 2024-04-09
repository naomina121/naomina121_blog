import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { siteConfig } from '../../../site.config'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import { IndexProps } from '@/types'
import { tags } from '@/utils/data'
import { allFetchPages } from '@/utils/notion'

export const getServerSideProps: GetServerSideProps = async () => {
  const { results } = await allFetchPages({})
  return {
    props: {
      pages: results ? results : [],
    },
  }
}

const tag: NextPage<IndexProps> = ({ pages }) => {
  const tag = pages.map((page) => tags(page))

  // setオブジェクトを介して重複分を削除
  let tag_array = new Set(tag)

  // 再度配列化
  let unique_pref_array = Array.from(tag_array)
  let string_array = unique_pref_array.join()
  let tags_array = string_array.split(',')
  let unique_tags = new Set(tags_array)
  let unique_tags_array = Array.from(unique_tags)

  return (
    <Layout>
      <>
        <Seo
          pageTitle={`タグ一覧`}
          pagePath={`${siteConfig.siteUrl}tag`}
          pageImg={`${siteConfig.siteUrl}ogp.jpg`}
          pageImgWidth={1200}
          pageImgHeight={800}
        />
        <h1 className='font-black text-2xl mt-6 mb-4'>タグ一覧</h1>
        <div className='p-6 mb-6 bg-white rounded-lg shadow-sm border-gray-200 border-[1px] flex justify-between'>
          <div className='flex flex-wrap pb-10'>
            {unique_tags_array.map((tag, index) => {
              if (unique_tags_array.length - 1 !== index) {
                return (
                  <Link
                    className='tag inline-block mx-2 text-blue-600 hover:underline'
                    href={'/tag/' + tag}
                    key={index}
                  >
                    {tag}
                  </Link>
                )
              }
            })}
          </div>
        </div>
      </>
    </Layout>
  )
}

export default tag
