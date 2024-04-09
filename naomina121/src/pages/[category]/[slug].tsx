import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import { siteConfig } from '../../../site.config'
import Breadcrumb from '@/components/Breadcrumb'
import Contents from '@/components/Contents'
import Layout from '@/components/Layout'
import MainToc from '@/components/MainToc'
import Seo from '@/components/Seo'
import useConfirm from '@/hooks/use-confirm'
import { ArticleProps, Params } from '@/types'
import {
  cover,
  description,
  jscategory,
  lastUpdatedAt,
  postCategory,
  postTitle,
  publishedAt,
  slug,
  tags,
} from '@/utils/data'
import dateToTime from '@/utils/date'
import { allFetchPages, fetchBlocksByPageId } from '@/utils/notion'

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as Params

  const { results: pages } = await allFetchPages({ slug: slug })
  const page = pages[0]
  const pageId = page.id
  const { results: blocks } = await fetchBlocksByPageId(pageId)

  if (!pages.length) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page: page,
      blocks: blocks,
    },
    revalidate: 60 * 60 * 24,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

interface FetchRequest {
  url: string
  options: object
}

async function fetchAsync(request: FetchRequest) {
  return await fetch(request.url, request.options)
}

const Article: FC<ArticleProps> = ({ page, blocks }) => {
  const url = `../../../api/image/${postCategory(page)}/${slug(page)}/?slug=${slug(
    page,
  )}&cat=${postCategory(page)}`

  const ogpUrl = `${siteConfig.siteTitle}api/image/${postCategory(page)}/${slug(page)}/?slug=${slug(
    page,
  )}&cat=${postCategory(page)}`

  // time
  const datePublished = dateToTime(publishedAt(page), 'YYYY-MM-DD')

  const dataUpdate = dateToTime(lastUpdatedAt(page), 'YYYY-MM-DD')

  const update = dateToTime(lastUpdatedAt(page), 'YYYY年MM月DD日')

  const published = dateToTime(publishedAt(page), 'YYYY年MM月DD日')

  const router = useRouter()

  const lastUpDate = lastUpdatedAt(page)

  const news = postCategory(page) === 'news-list'

  // 画像の有効期限が切れているかどうか
  const isExpired = (blocks: Array<any>): boolean => {
    const now = Date.now()

    const imageArray = blocks.filter(
      (block) => block.type === 'image' && block.image.file.expiry_time,
    )

    const newFindArry = imageArray.find((block) => {
      const image = block.image.file.expiry_time
      return Date.parse(image) < now
    })

    if (newFindArry === undefined) {
      return false
    }
    return true
  }

  const { fc } = useConfirm()
  const { cmp } = useConfirm()
  const { confirm } = fc

  useEffect(() => {
    ;(async function () {
      try {
        if (!isExpired(blocks)) {
          const diffRes = await fetchAsync({
            url: `../../api/diff`,
            options: {
              method: 'POST',
              body: JSON.stringify({
                slug: slug(page),
                lastUpDate: lastUpDate,
              }),
            },
          })
          if (diffRes.status !== 200) {
            throw new Error('diffRes:status:' + diffRes.status)
          }
          console.log(diffRes.status)
        }

        const res = await fetchAsync({
          url: `../../api/isr/req?path=${`/${postCategory(page)}/${slug(page)}`}`,
          options: {
            method: 'GET',
          },
        })
        if (res.status !== 200) {
          throw new Error('res:status:' + res.status)
        }
        const options = {
          html: true,
          alert: true,
        }

        await confirm({ ...options })
          .then(() => {
            cmp.resolve = () => {}
            router.reload()
            return true
          })
          .catch(() => {
            cmp.reject = () => {}
            return true
          })
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  return (
    <Layout>
      <>
        <Seo
          pageTitle={postTitle(page)}
          pageDescription={description(page)}
          pageImg={'/images/ogp.png'}
          pageImgWidth={1152}
          pageImgHeight={622}
          pagePath={`${siteConfig.siteUrl}${postCategory(page)}/${slug(page)}`}
        />
        <Breadcrumb
          breadList={`${postCategory(page)}/${slug(page)}`}
          breadListJs={`${jscategory(page)}/${postTitle(page)}`}
        />

        <div className='p-6 bg-white rounded-lg shadow-sm border-gray-200 border-[1px]'>
          <div>
            <div className='flex mb-3 justify-between flex-col'>
              <div className='flex justify-end items-end'>
                <Link href='' className='hover:opacity-80'>
                  <span className='py-1 px-2 inline-block mr-2 text-white align-middle text-sm bg-green-800'>
                    {jscategory(page)}
                  </span>
                </Link>

                {tags(page).map((tag, index) => (
                  <Link key={index} href={`/tag/${tag}`} className='hover:opacity-80'>
                    <span className='mr-2 inline-block align-middle text-sm font-bold bg-gray-200 px-2 py-1'>
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
              <div className='flex items-end text-sm ml-auto mt-4'>
                <span className='align-middle font-bold mr-4'>
                  公開日:
                  <time itemProp='datePublished' dateTime={datePublished}>
                    {published}
                  </time>
                </span>
                <span className='align-middle font-bold mr-4'>
                  更新日:
                  <time itemProp='dateModified' dateTime={dataUpdate}>
                    {update}
                  </time>
                </span>
              </div>
            </div>
            {/* OGP */}
            {!news && (
              <img
                src={url}
                alt={postTitle(page)}
                width={1200}
                height={630}
                onError={(e) => {
                  e.currentTarget.src = `/img/none.jpg`
                }}
              />
            )}
            <div className='content'>
              <h1 className='font-black text-2xl mt-6 mb-4'>{postTitle(page)}</h1>
              <MainToc />
              <Contents blocks={blocks} />
            </div>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Article
