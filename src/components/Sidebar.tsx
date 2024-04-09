import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { siteConfig } from '../../site.config'

const Sidebar = () => {
  // 現在のルートを取得
  const router = useRouter()
  // 現在のルートがあるカテゴリーのページかどうかを判定
  const current = (category: string) => {
    return router.asPath === category ? `current ` : ''
  }

  return (
    <aside>
      <h1 className='logo'>
        <Link className='hover:text-lime-200' href='/'>
          {siteConfig.siteTitle}
        </Link>
      </h1>
      <nav className='mt-6'>
        <ul>
          <li>
            <Link href={`/majime`} className={current('/majime')}>
              まじめな話
            </Link>
          </li>
          <li>
            <Link href={`/huzaketa`} className={current('/huzaketa')}>
              ふざけた話
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
