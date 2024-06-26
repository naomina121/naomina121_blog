import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { siteConfig } from '../../../site.config'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'

const privacy = () => {
  return (
    <Layout>
      <>
        <Seo
          pageTitle={`プライバシーポリシー`}
          pagePath={`${siteConfig.siteUrl}privacy-policy`}
          pageImg={`${siteConfig.siteUrl}ogp.jpg`}
          pageImgWidth={1200}
          pageImgHeight={800}
        />
        <h1 className='font-black text-2xl mb-6'>プライバシーポリシー</h1>
        <div className='p-6 bg-white rounded-lg shadow-sm border-gray-200 border-[1px] content'>
          <p>
            【naomina121】(以下「当ブログ」)のプライバシーポリシー・免責事項を次の通り記載します。
          </p>
          <h2 id='個人情報の利用目的について'>個人情報の利用目的について</h2>
          <p>
            当ブログでは、お問い合わせの際に氏名・メールアドレス等の個人情報を入力いただく場合があります。
          </p>
          <p>
            取得した個人情報は、必要な連絡のみに利用させていただくもので、これらの目的以外では利用いたしません。
          </p>
          <h2 id='個人情報の第三者開示について'>個人情報の第三者開示について</h2>
          <p>
            取得した個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
          </p>
          <ul>
            <li>本人の同意が得られた場合</li>
            <li>法令により開示が求められた場合</li>
          </ul>
          <h2 id='Cookieの使用について'>Cookieの使用について</h2>
          <p>当ブログでは、アクセス解析のためにCookieを使用しています</p>
          <p>
            Cookieによりブラウザを識別していますが、特定の個人の識別はできない状態で匿名性が保たれています。
          </p>
          <p>Cookieの使用を望まない場合、ブラウザからCookieを無効に設定できます。</p>
          <h2 id='アクセス解析ツールについて'>アクセス解析ツールについて</h2>
          <p>当ブログでは、Googleアナリティクスによりアクセス情報を解析しています。</p>
          <p>
            アクセス情報の解析にはCookieを使用しています。また、アクセス情報の収集はCookieを無効にすることで拒否できます。
          </p>
          <p>
            Google社のデータ収集・処理の仕組みについては、
            <Link
              href='https://policies.google.com/technologies/partner-sites?hl=ja'
              target='_blank'
            >
              こちら
            </Link>
            をご覧ください。
          </p>
          <h2 id='免責事項'>免責事項</h2>
          <p>当ブログは、掲載内容によって生じた損害に対する一切の責任を負いません。</p>
          <p>
            各コンテンツでは、できる限り正確な情報提供を心がけておりますが、正確性や安全性を保証するものではありません。
          </p>
          <p>
            また、リンク先の他サイトで提供される情報・サービスについても、責任を負いかねますのでご了承ください。
          </p>
          <h2 id='著作権'>著作権</h2>
          <p>当ブログに掲載されている文章・画像の著作権は、運営者に帰属しています。</p>
          <p>法的に認められている引用の範囲を超えて、無断で転載することを禁止します。</p>
          <h2 id='プライバシーポリシーの変更'>プライバシーポリシーの変更</h2>
          <p>
            当ブログは、個人情報に関して適用される日本の法令を遵守するとともに、本プライバシーポリシーの内容を適宜見直して改善に努めます。
          </p>
          <p>修正された最新のプライバシーポリシーは常に本ページにて開示されます。</p>
          <p>制定日:2024年4月9日</p>
          <p>【Naomina121】 【ナオ】</p>
        </div>
      </>
    </Layout>
  )
}

export default privacy
