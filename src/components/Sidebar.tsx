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
            <Link href={`/for-first-time-users`} className={current('/for-first-time-users')}>
              初めての方へ
            </Link>
          </li>
          <li>
            <Link href={`/majime`} className={current('/majime')}>
              まじめな話
            </Link>
          </li>
          <li>
            <Link href={`/neta`} className={current('/neta')}>
              ネタ話
            </Link>
          </li>
          <li>
            <Link href={`https://mint-note.net`} target='blank'>
              MintNote <br/> -心のケアノート-
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
