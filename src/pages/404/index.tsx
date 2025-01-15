import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { siteConfig } from '../../../site.config'
import Breadcrumb from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'

const CustomErrorPage = () => {
  return (
    <Layout>
      <>
        <Seo
          pageTitle={`404 Not Found`}
          pagePath={`${siteConfig.siteUrl}404`}
          pageImg={`${siteConfig.siteUrl}ogp.jpg`}
          pageImgWidth={1200}
          pageImgHeight={800}
        />
        <h1 className='font-black text-2xl mt-6 mb-4'>404 Not Found</h1>
        <Breadcrumb breadList={`404`} breadListJs={`404 Not Found`} />
        <div className='p-6 mb-6 bg-white rounded-lg shadow-sm border-gray-200 border-[1px] flex justify-between'>
          <p>お探しのページは見つかりませんでした。</p>
        </div>
      </>
    </Layout>
  )
}

export default CustomErrorPage
