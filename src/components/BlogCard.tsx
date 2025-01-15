import Image from 'next/image'
import React, { FC } from 'react'
import { BlogCardData } from '@/types'

const BlogCard: FC<BlogCardData> = ({ cardData, blankProp }) => {
  return (
    <a
      href={cardData.url}
      className='flex bg-white rounded-md card-link px-2 py-4 max-h-[170px]'
      {...blankProp}
    >
      <div className='flex mx-auto w-full px-4 justify-between items-center overflow-hidden'>
        <div className='flex flex-col justify-start w-full mr-4 max-w-xl'>
          <p className='card-title'>{cardData.title}</p>
          <p className='card-description'>{cardData.description}</p>
          <span className='w-full text-ellipsis overflow-hidden text-xs'>{cardData.url}</span>
        </div>
        <img
          src={cardData.image ? cardData.image : '/img/noimg.jpg'}
          alt={cardData.title}
          width='100'
          height='100'
          className='object-contain w-[200px] h-auto max-w-xs'
        />
      </div>
    </a>
  )
}

export default BlogCard
