import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { siteConfig } from '../../site.config'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import { FrontProps } from '@/types'
import { jscategory, lastUpdatedAt, postCategory, postTitle, publishedAt, slug } from '@/utils/data'
import dateToTime from '@/utils/date'
import { allFetchPages } from '@/utils/notion'

export const getStaticProps: GetStaticProps = async () => {
  // NotionAPIからデータを取得する
  const { results: pages } = await allFetchPages({ exclusion: 'news-list' })
  const { results: newsPages } = await allFetchPages({ category: 'news-list' })
  // ダミーデータを渡す。
  //const pages = dammyPages

  return {
    props: {
      pages: pages ? pages : [],
      newsPages: newsPages ? newsPages : [],
    },
    revalidate: 10,
  }
}

const Home: FC<FrontProps> = ({ pages, newsPages }) => {
  return (
    <Layout>
      <>
        <Seo
          pagePath={`${siteConfig.siteUrl}`}
          pageImg={`${siteConfig.siteUrl}ogp.jpg`}
          pageImgWidth={1200}
          pageImgHeight={800}
        />
        <div className='p-6 bg-white rounded-lg shadow-sm border-gray-200 border-[1px]'>
          <h2 className='font-black text-2xl mb-2'>お知らせ</h2>
          <p className='text-right'>
            <Link
              href='news-list'
              className='block w-[150px] text-sm ml-auto my-6 bg-blue-900 text-white rounded-lg hover:bg-blue-600 p-2'
            >
              お知らせ一覧を見る
            </Link>
          </p>
          <ul>
            {newsPages.map(
              (news, index) =>
                index < 3 && (
                  <li
                    key={index}
                    className='flex mb-2 border-dotted pb-2 border-gray-300 border-b-[1px]'
                  >
                    <time
                      itemProp='datePublished'
                      dateTime={dateToTime(publishedAt(news), 'YYYY-MM-DD')}
                      className='font-black text-gray-700 w-[90px] block mr-4'
                    >
                      {dateToTime(publishedAt(news), 'YYYY/MM/DD')}
                    </time>
                    <Link
                      href={'/news-list/' + slug(news)}
                      className='underline ml-4 text-blue-700 hover:no-underline font-bold'
                    >
                      {postTitle(news)}
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </div>
        <div className='my-6'>
          <Image
            src='/blog2.jpg'
            alt='ナオのブログ'
            width={1200}
            height={800}
            className='object-cover rounded-lg'
          />
        </div>
        <div className='my-6 flex justify-between lg:flex-col'>
          <div className='p-0 bg-white max-w-full w-full lg:mb-6'>
            <ul className='flex flex-wrap w-full justify-between'>
              {pages.map(
                (page, index) =>
                  index < 30 && (
                    <li
                      key={index}
                      className='w-[410px] rounded-lg shadow-sm p-4 border-gray-200 border-[1px] overflow-hidden text-ellipsis mb-4'
                    >
                      <img
                        src={`../../../api/image/${postCategory(page)}/${slug(page)}/?slug=${slug(
                          page,
                        )}&cat=${postCategory(page)}`}
                        alt={postTitle(page)}
                        width={1200}
                        height={630}
                        onError={(e) => {
                          e.currentTarget.src = `/img/none.jpg`
                        }}
                        className='object-cover w-[400px] h-[250px] mb-2'
                      />
                      <p className='text-sm'>
                        <span>
                          最終更新日：
                          <time itemProp='dateModified' dateTime={dateToTime(lastUpdatedAt(page))}>
                            {dateToTime(lastUpdatedAt(page), 'YYYY/MM/DD')}
                          </time>
                        </span>
                        {/* <span className='inline-block ml-4'>カテゴリー:</span> */}
                        <span className='inline-block ml-2 category text-gray-600 font-bold'>
                          {jscategory(page)}
                        </span>
                      </p>
                      <Link
                        href={'/' + postCategory(page) + '/' + slug(page)}
                        className='mt-1 inline-block text-ellipsis underline text-sky-700 hover:no-underline font-bold truncate w-full'
                      >
                        {postTitle(page)}
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Home
