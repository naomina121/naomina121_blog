import Link from 'next/link'
import React, { FC } from 'react'
import { BreadcrumbProps } from '@/types'

const Breadcrumb: FC<BreadcrumbProps> = ({ breadList, breadListJs }) => {
  const str = String(breadList)
  const str2 = String(breadListJs)
  const paths = str.split('/')
  const paths2 = str2.split('/')
  const roots = ['/']
  for (let i = 0; i < paths.length; i++) roots.push(roots[i] + '/' + paths[i])

  return (
    <div className='w-full'>
      <ul className='w-full max-w-6xl mx-auto ml-4 py-2 flex justify-start items-center overflow-auto scrolling-touch'>
        <li className='flex'>
          <Link
            className='text-sm text-sky-600 duration-500 hover:text-sky-700 font-medium whitespace-nowrap'
            href='/'
          >
            ホーム
          </Link>
        </li>
        {paths.map((x, i) => {
          if (paths.length - 1 !== i) {
            return (
              <li className='flex' key={i}>
                <span className='text-sm pl-3'>&gt;</span>
                <Link
                  className='text-sm ml-4 text-sky-600 duration-500 hover:text-sky-700 font-medium whitespace-nowrap'
                  href={roots[i + 1]}
                  key={i}
                >
                  {paths2[i]}
                </Link>
              </li>
            )
          } else {
            return (
              <li className='flex' key={i}>
                <span className='text-sm pl-3'>&gt;</span>
                <span className='w-full max-w-full md:max-w-full whitespace-nowrap text-sm font-semibold text-gray-600 pl-4'>
                  {paths2[i]}
                </span>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
export default Breadcrumb
