import Link from 'next/link'
import React, { FC } from 'react'
import { PaginationProps } from '@/types'

const Pagination: FC<PaginationProps> = ({ numberOfPage, category, current }) => {
  let pages: number[] = []
  for (let i = 1; i <= Number(numberOfPage); i++) {
    pages.push(i)
  }

  // 現在のページがどのページかを判断する
  const isCurrent = (page: number) => {
    if (page === parseInt(current)) {
      return true
    } else {
      return false
    }
  }

  // 前へが必要かどうかを判断する
  const prev = () => {
    if (parseInt(current) === 1) {
      return false
    } else {
      return true
    }
  }

  // 次へが必要かどうかを判断する
  const next = () => {
    if (pages.length === parseInt(current)) {
      return false
    } else {
      return true
    }
  }

  // 前へのリンク
  const prevLink = () => {
    if (prev() === true) {
      return (
        <Link
          className='text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md'
          href={`/${category}/page/${parseInt(current) - 1}`}
        >
          <span aria-hidden='true'>«</span>
          <span className='sr-only'>前へ</span>
        </Link>
      )
    }
  }

  // 次へのリンク
  const nextLink = () => {
    if (next() === true) {
      return (
        <Link
          className='text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md'
          href={`/${category}/page/${parseInt(current) + 1}`}
        >
          <span className='sr-only'>次へ</span>
          <span aria-hidden='true'>»</span>
        </Link>
      )
    }
  }

  return (
    <nav className='flex justify-center items-center space-x-2'>
      {prevLink()}
      <ul className=' flex justify-center items-center space-x-2'>
        {pages.map((page, i) => (
          <li key={i}>
            {/* 現在のページの場合はリンクを貼らない */}
            {isCurrent(page) ? (
              <span
                className={`bg-green-600 w-10 h-10 text-white p-4 inline-flex items-center text-sm font-medium rounded-full`}
                aria-current='page'
              >
                {page}
              </span>
            ) : (
              <Link
                className={`bg-gray-600 w-10 h-10 hover:bg-gray-400 p-4 inline-flex items-center text-sm font-medium rounded-full`}
                href={`/${category}/page/${page}`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
      </ul>
      {nextLink()}
    </nav>
  )
}

export default Pagination
