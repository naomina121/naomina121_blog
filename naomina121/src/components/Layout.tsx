import React, { ReactElement } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='container bg-white max-w-[1920px] mx-auto'>
      <div className='box'>
        <Sidebar />
        <main>
          <Header />
          <div className='m-6'>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
