import Link from 'next/link'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import SpNavgation from './SpNavgation'
import { siteConfig } from '../../site.config'

const Header = () => {
  const isBreakPoint = useMediaQuery({ query: `(max-width:1200px)` })
  return (
    <header className='flex justify-end mt-6 mr-6'>
      {isBreakPoint ? (
        <div className='flex w-full p-4 items-center justify-between bg-gray-800 ml-6 rounded-sm'>
          <div>
            <h1 className='logo'>
              <Link className='text-3xl text-white hover:opacity-[0.7]' href='/'>
                {siteConfig.siteTitle}
              </Link>
            </h1>
          </div>
          <SpNavgation />
        </div>
      ) : (
        <div className='flex items-center'>
          <Link
            href='/sitemap'
            className='bg-green-900 font-normal rounded-lg hover:text-yellow-300 text-white text-sm p-2'
          >
            サイトマップ
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header
