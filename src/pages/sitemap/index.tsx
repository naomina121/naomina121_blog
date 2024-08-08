import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { siteConfig } from '../../../site.config'
import Breadcrumb from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'

const sitemap = () => {
  return (
    <Layout>
      <>
        <Seo
          pagePath={`${siteConfig.siteUrl}sitemap`}
          pageImg={`${siteConfig.siteUrl}ogp.jpg`}
          pageImgWidth={1200}
          pageImgHeight={800}
        />
        <h1 className='font-black text-2xl mb-6'>サイトマップ</h1>
        <Breadcrumb breadList={`sitemap`} breadListJs={`サイトマップ`} />

        <h2 className='font-black mt-2 text-lg mb-6 bg-white py-4 pl-6 shadow-sm border-l-[8px] border-yellow-600 '>
          カテゴリー
        </h2>
        <div className='p-6 bg-white rounded-lg shadow-sm border-gray-200 border-[1px]'>
          <h3 className='font-black text-lg mb-2'>
            <ul className='space-y-3 text-xm'>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 h-8 w-8 text-blue-600'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.1965 7.85999C15.1965 3.71785 11.8387 0.359985 7.69653 0.359985C3.5544 0.359985 0.196533 3.71785 0.196533 7.85999C0.196533 12.0021 3.5544 15.36 7.69653 15.36C11.8387 15.36 15.1965 12.0021 15.1965 7.85999Z'
                    fill='currentColor'
                    fill-opacity='0.1'
                  />
                  <path
                    d='M10.9295 4.88618C11.1083 4.67577 11.4238 4.65019 11.6343 4.82904C11.8446 5.00788 11.8702 5.32343 11.6914 5.53383L7.44139 10.5338C7.25974 10.7475 6.93787 10.77 6.72825 10.5837L4.47825 8.5837C4.27186 8.40024 4.25327 8.0842 4.43673 7.87781C4.62019 7.67142 4.93622 7.65283 5.14261 7.83629L7.01053 9.49669L10.9295 4.88618Z'
                    fill='currentColor'
                  />
                </svg>
                <Link
                  href='/majime'
                  className='text-gray-800 font-bold underline hover:no-underline'
                >
                  まじめな話
                </Link>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 h-8 w-8 text-blue-600'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.1965 7.85999C15.1965 3.71785 11.8387 0.359985 7.69653 0.359985C3.5544 0.359985 0.196533 3.71785 0.196533 7.85999C0.196533 12.0021 3.5544 15.36 7.69653 15.36C11.8387 15.36 15.1965 12.0021 15.1965 7.85999Z'
                    fill='currentColor'
                    fill-opacity='0.1'
                  />
                  <path
                    d='M10.9295 4.88618C11.1083 4.67577 11.4238 4.65019 11.6343 4.82904C11.8446 5.00788 11.8702 5.32343 11.6914 5.53383L7.44139 10.5338C7.25974 10.7475 6.93787 10.77 6.72825 10.5837L4.47825 8.5837C4.27186 8.40024 4.25327 8.0842 4.43673 7.87781C4.62019 7.67142 4.93622 7.65283 5.14261 7.83629L7.01053 9.49669L10.9295 4.88618Z'
                    fill='currentColor'
                  />
                </svg>
                <Link
                  href='/neta'
                  className='text-gray-800 font-bold underline hover:no-underline'
                >
                  ネタ話
                </Link>
              </li>
            </ul>
          </h3>
        </div>
        <h2 className='mt-6 font-black text-lg mb-6 bg-white py-4 pl-6 shadow-sm border-l-[8px] border-yellow-600 '>
          その他
        </h2>
        <div className='p-6 bg-white rounded-lg shadow-sm border-gray-200 border-[1px]'>
          <h3 className='font-black text-lg mb-2'>
            <ul className='space-y-3 text-xm'>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 h-8 w-8 text-blue-600'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.1965 7.85999C15.1965 3.71785 11.8387 0.359985 7.69653 0.359985C3.5544 0.359985 0.196533 3.71785 0.196533 7.85999C0.196533 12.0021 3.5544 15.36 7.69653 15.36C11.8387 15.36 15.1965 12.0021 15.1965 7.85999Z'
                    fill='currentColor'
                    fill-opacity='0.1'
                  />
                  <path
                    d='M10.9295 4.88618C11.1083 4.67577 11.4238 4.65019 11.6343 4.82904C11.8446 5.00788 11.8702 5.32343 11.6914 5.53383L7.44139 10.5338C7.25974 10.7475 6.93787 10.77 6.72825 10.5837L4.47825 8.5837C4.27186 8.40024 4.25327 8.0842 4.43673 7.87781C4.62019 7.67142 4.93622 7.65283 5.14261 7.83629L7.01053 9.49669L10.9295 4.88618Z'
                    fill='currentColor'
                  />
                </svg>
                <Link href='#' className='text-gray-800 font-bold underline hover:no-underline'>
                  お知らせ一覧
                </Link>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 h-8 w-8 text-blue-600'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.1965 7.85999C15.1965 3.71785 11.8387 0.359985 7.69653 0.359985C3.5544 0.359985 0.196533 3.71785 0.196533 7.85999C0.196533 12.0021 3.5544 15.36 7.69653 15.36C11.8387 15.36 15.1965 12.0021 15.1965 7.85999Z'
                    fill='currentColor'
                    fill-opacity='0.1'
                  />
                  <path
                    d='M10.9295 4.88618C11.1083 4.67577 11.4238 4.65019 11.6343 4.82904C11.8446 5.00788 11.8702 5.32343 11.6914 5.53383L7.44139 10.5338C7.25974 10.7475 6.93787 10.77 6.72825 10.5837L4.47825 8.5837C4.27186 8.40024 4.25327 8.0842 4.43673 7.87781C4.62019 7.67142 4.93622 7.65283 5.14261 7.83629L7.01053 9.49669L10.9295 4.88618Z'
                    fill='currentColor'
                  />
                </svg>
                <Link href='#' className='text-gray-800 font-bold underline hover:no-underline'>
                  サイトマップ
                </Link>
              </li>
              <li className='flex space-x-3'>
                <svg
                  className='flex-shrink-0 h-8 w-8 text-blue-600'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.1965 7.85999C15.1965 3.71785 11.8387 0.359985 7.69653 0.359985C3.5544 0.359985 0.196533 3.71785 0.196533 7.85999C0.196533 12.0021 3.5544 15.36 7.69653 15.36C11.8387 15.36 15.1965 12.0021 15.1965 7.85999Z'
                    fill='currentColor'
                    fill-opacity='0.1'
                  />
                  <path
                    d='M10.9295 4.88618C11.1083 4.67577 11.4238 4.65019 11.6343 4.82904C11.8446 5.00788 11.8702 5.32343 11.6914 5.53383L7.44139 10.5338C7.25974 10.7475 6.93787 10.77 6.72825 10.5837L4.47825 8.5837C4.27186 8.40024 4.25327 8.0842 4.43673 7.87781C4.62019 7.67142 4.93622 7.65283 5.14261 7.83629L7.01053 9.49669L10.9295 4.88618Z'
                    fill='currentColor'
                  />
                </svg>
                <Link
                  href='/privacy-policy'
                  className='text-gray-800 font-bold underline hover:no-underline'
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </h3>
        </div>
      </>
    </Layout>
  )
}

export default sitemap
