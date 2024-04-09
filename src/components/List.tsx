import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { ListProps } from '@/types'
import {
  cover,
  description,
  jscategory,
  lastUpdatedAt,
  postCategory,
  postTitle,
  publishedAt,
  slug,
} from '@/utils/data'
import dateToTime from '@/utils/date'

const List: FC<ListProps> = ({ page, key }) => {
  const datePublished = dateToTime(publishedAt(page), 'YYYY-MM-DD')

  const dataUpdate = dateToTime(lastUpdatedAt(page), 'YYYY-MM-DD')

  const update = dateToTime(lastUpdatedAt(page), 'YYYY年MM月DD日')

  const published = dateToTime(publishedAt(page), 'YYYY年MM月DD日')
  console.log(postCategory(page))
  return (
    <li key={key} className='py-6 mb-6 bg-white border-b-[1px]  flex justify-between'>
      {/* <div className='w-[260px]'>
        <Image src={cover(page)} alt='test' width={220} height={118.78} className='rounded-lg' />
      </div> */}
      <div className='pl-6 overflow-hidden w-full text-ellipsis text-xs inline-block'>
        <div className='mb-4'>
          <span className='py-1 px-2 text-white align-middle bg-green-800 mr-4'>
            {jscategory(page)}
          </span>
        </div>

        <div>
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
          className='object-cover w-[400px] h-[250px] my-4'
        />

        <h3 className='font-bold mt-2'>
          <Link
            href={'/' + postCategory(page) + '/' + slug(page)}
            className='underline hover:no-underline text-lg'
          >
            {postTitle(page)}
          </Link>
        </h3>
        <p className='text-sm mt-2'>{description(page)}</p>
      </div>
    </li>
  )
}

export default List
