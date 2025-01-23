import parse, { domToReact } from 'html-react-parser'
import React, { FC, useEffect, useState } from 'react'
import tocbot from 'tocbot'
import BlogCard from './BlogCard'
import { BlockType, ContentsProps, RichTextType } from '@/types'
import ReadingTime from '@/components/ReadingTime'
import { useRouter } from 'next/router'

// ======================================
// fetchAsync: fetch をラップする関数
// ======================================
interface FetchRequest {
  url: string
  options: object
}

async function fetchAsync(request: FetchRequest) {
  return await fetch(request.url, request.options)
}

// ======================================
// HTML文字列からテキストのみ抽出
// ======================================
export const extractTextFromHTML = (html: string): string => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || ''
}

// =====================================================================
// RichTextをHTML文字列に変換(装飾付き)
// =====================================================================
const RichTextStyling = (contents: RichTextType[] | undefined): string => {
  const Styling: string[] = []
  if (contents === undefined) {
    return ''
  }
  contents.forEach((content) => {
    const text = content.plain_text
    const link = content.text?.link

    if (content.type !== 'text' || text.trim() === '') {
      return
    }
    if (content.href !== null) {
      // リンク付き
      if (content.annotations?.strikethrough) {
        Styling.push(
          `<a class="text-blue-600 hover:opacity-80 ${
            content.annotations.bold ? 'font-bold ' : ''
          }${content.annotations.italic ? 'italic ' : ''}${
            content.annotations.underline ? 'underline decoration-1' : ''
          }" href="${content.href}" target="_blank"><s>${text}</s></a>`
        )
      } else {
        Styling.push(
          `<a class="text-blue-600 hover:opacity-80 ${
            content.annotations.bold ? 'font-bold ' : ''
          }${content.annotations.italic ? 'italic ' : ''}${
            content.annotations.underline ? 'underline decoration-1' : ''
          }" href="${content.href}" target="_blank">${text}</a>`
        )
      }
    } else {
      // 通常テキスト
      if (content.annotations?.strikethrough) {
        Styling.push(
          `<s class="${
            content.annotations.bold ? 'font-bold ' : ''
          }${content.annotations.italic ? 'italic ' : ''}${
            content.annotations.underline ? 'underline decoration-1 ' : ''
          }${content.annotations.color || ''}">${text}</s>`
        )
      } else if (link) {
        // リンク指定 (link.url) がある場合
        Styling.push(`<a href="${link.url}">${text}</a>`)
      } else {
        Styling.push(
          `<span class="${
            content.annotations.bold ? 'font-bold ' : ''
          }${content.annotations.italic ? 'italic ' : ''}${
            content.annotations.underline ? 'underline decoration-1 ' : ''
          }${content.annotations.color || ''}">${text}</span>`
        )
      }
    }
  })
  return Styling.join('')
}

// =====================================================================
// テーブルのセル用: RichTextをHTML文字列に変換
// =====================================================================
const CellsTextStyling = (contents: RichTextType[] | undefined): string => {
  if (!contents) return ''
  // 上記 RichTextStyling と似たロジックでOK
  // テーブル内用に分けているので、独自のクラス名など必要なら追加
  return RichTextStyling(contents)
}

// =====================================================================
// 1. メインの再帰パース関数
//    -> 連続するリストを <ul> or <ol> にまとめ、
//       それ以外は renderBlock() で単体処理
// =====================================================================
function parseBlocks(blocks: BlockType[], startIndex = 0): { html: string; nextIndex: number } {
  let html = ''
  let i = startIndex

  while (i < blocks.length) {
    const block = blocks[i]

    // ----------------------------------------------------------
    // 連続する bulleted_list_item を <ul> でまとめる
    // ----------------------------------------------------------
    if (block.type === 'bulleted_list_item') {
      const { listHtml, nextIndex } = parseList(blocks, i, 'bulleted_list_item')
      html += listHtml
      i = nextIndex
      continue
    }
    // ----------------------------------------------------------
    // 連続する numbered_list_item を <ol> でまとめる
    // ----------------------------------------------------------
    else if (block.type === 'numbered_list_item') {
      const { listHtml, nextIndex } = parseList(blocks, i, 'numbered_list_item')
      html += listHtml
      i = nextIndex
      continue
    }
    // ----------------------------------------------------------
    // それ以外 (heading, table, paragraph など)
    // ----------------------------------------------------------
    else {
      html += renderBlock(block)
      i++
    }
  }

  return { html, nextIndex: i }
}

// =====================================================================
// 2. リストブロック(bulleted/numbered)を連続処理し、<ul>/<ol> でまとめる
//    - 子ブロックがある場合は parseBlocks() 再帰
// =====================================================================
function parseList(
  blocks: BlockType[],
  startIndex: number,
  listType: 'bulleted_list_item' | 'numbered_list_item'
): { listHtml: string; nextIndex: number } {
  const tag = (listType === 'bulleted_list_item') ? 'ul' : 'ol'
  let listHtml = `<${tag} class="my-6 ${tag === 'ul' ? 'list-disc' : 'list-decimal'}">`
  let i = startIndex

  while (i < blocks.length && blocks[i].type === listType) {
    const block = blocks[i]
    // リスト本文
    const text = (listType === 'bulleted_list_item')
      ? RichTextStyling(block.bulleted_list_item?.rich_text)
      : RichTextStyling(block.numbered_list_item?.rich_text)

    listHtml += `<li class="mb-2 ml-6">${text}`

    // もし子ブロックを持っていれば、再帰的に parseBlocks してネスト処理
    if (block.children && block.children.length > 0) {
      const { html: childHtml } = parseBlocks(block.children, 0)
      listHtml += childHtml
    }

    listHtml += '</li>'
    i++
  }

  listHtml += `</${tag}>`

  return { listHtml, nextIndex: i }
}

// =====================================================================
// 3. 単体ブロックのHTML変換 (リストは除く)
//    - テーブルの場合は block.children の table_row を renderTableRows() で処理
// =====================================================================
function renderBlock(block: BlockType): string {
  switch (block.type) {
    case 'heading_2':
      return `<h2 class="my-6 bg-emerald-100 p-3 text-2xl text-gray-700"
        id="${block.heading_2?.rich_text[0]?.plain_text || ''}">
        ${RichTextStyling(block.heading_2?.rich_text)}
      </h2>`

    case 'heading_3':
      return `<h3 class="my-6 border-b-2 border-solid py-3 text-xl text-gray-600"
        id="${block.heading_3?.rich_text[0]?.plain_text || ''}">
        ${RichTextStyling(block.heading_3?.rich_text)}
      </h3>`

    case 'paragraph': {
      if (!block.paragraph?.rich_text || block.paragraph.rich_text.length === 0) return ''
      return `<p>${RichTextStyling(block.paragraph.rich_text)}</p>`
    }

    case 'quote':
      return `
<blockquote class="text-base bg-gray-100 p-4 italic font-semibold text-gray-900 my-6">
  <svg class="w-6 h-6 text-gray-400 mb-1" fill="currentColor" viewBox="0 0 18 14">
    <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1
     a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0
     2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1
     a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
  </svg>
  <span class="inline-block">${RichTextStyling(block.quote?.rich_text)}</span>
</blockquote>`

    case 'callout':
      return `<div class="my-6 ${block.callout?.color || ''} border-l-4 p-4" role='alert'>
        <span>${block.callout?.icon?.emoji || ''}</span>
        ${RichTextStyling(block.callout?.rich_text)}
      </div>`

    case 'divider':
      return `<div class="my-6"><hr class="border-gray-200" /></div>`

    case 'image': {
      const src = block.image?.file
      ? block.image.file.url
      : block.image?.external?.url

      // caption配列の先頭要素のplain_textを安全に取り出す
      const alt = block.image?.caption?.[0]?.plain_text ?? ''
      return `<img class="my-6 inline-block" src="${src}" alt="${alt}" />`
    }

    case 'video':
      return `<div class="my-6">
        <iframe class="w-full youtube-16-9" src="${block.video?.external?.url}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>`

    case 'embed':
      return `<div class="my-6">
        <iframe style="border-radius:12px" src="${block.embed?.url}"
          width="100%" class="youtube-16-9" frameBorder="0" allowfullscreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
        </iframe>
      </div>`

    // テーブルブロック
    case 'table':
      return renderTable(block)

    // table_row (テーブルの子) は、renderTable() 内で処理するためここでは空
    case 'table_row':
      return ''

    default:
      return ''
  }
}

// =====================================================================
// 4. table ブロックをHTMLに
//    - block.children に table_row が並んでいる想定
// =====================================================================
function renderTable(tableBlock: BlockType): string {
  const { has_column_header, has_row_header, table_width } = tableBlock.table || {}
  const rowBlocks = tableBlock.children || []

  let html = `<table class="my-6 w-full border-collapse border border-gray-200">`
  let isHeadCreated = false
  let rowCount = 0

  for (const rowBlock of rowBlocks) {
    if (rowBlock.type !== 'table_row') continue
    const cells = rowBlock.table_row?.cells || []
    const colCount = table_width || cells.length

    // カラムヘッダあり & 最初の行 => thead
    if (has_column_header && rowCount === 0) {
      html += '<thead><tr>'
      for (let c = 0; c < colCount; c++) {
        html += `<th class="bg-gray-100 text-left p-1 border border-gray-200">`
        if (cells[c]) {
          html += RichTextStyling(cells[c])
        }
        html += '</th>'
      }
      html += '</tr></thead>'
      isHeadCreated = true
    } else {
      // tbody開始
      if (rowCount === 0 && !isHeadCreated) {
        html += '<tbody>'
      } else if (rowCount === 1 && isHeadCreated) {
        html += '<tbody>'
      }
      html += '<tr>'
      for (let c = 0; c < colCount; c++) {
        // 行ヘッダ
        if (has_row_header && c === 0) {
          html += `<th class="bg-gray-100 p-1 border border-gray-200">`
          if (cells[c]) {
            html += RichTextStyling(cells[c])
          }
          html += '</th>'
        } else {
          html += `<td class="p-1 border border-gray-200">`
          if (cells[c]) {
            html += CellsTextStyling(cells[c])
          }
          html += '</td>'
        }
      }
      html += '</tr>'
    }
    rowCount++
  }

  if (rowCount > 0) {
    html += '</tbody>'
  }
  html += '</table>'
  return html
}

// =====================================================================
// 5. Contents コンポーネント
//    - Notion ブロックを parseBlocks() でHTML化
//    - テキスト抽出, tocbot, リンクカード差し替えなど
// =====================================================================
const Contents: FC<ContentsProps> = ({ blocks }) => {
  const [html, setHtml] = useState(
    parse('<p>只今、記事の読み込み中です。恐れ入りますが今しばらくお待ちください</p>')
  )
  const [textContent, setTextContent] = useState<string>('')

  const router = useRouter()
  const isExcludedPage =
    router.pathname === '/news-list/[slug]' || router.asPath.startsWith('/news-list/')

  // ---------------------------
  // 変換処理
  // ---------------------------
  const NotionToHtml = async (blocks: BlockType[]) => {
    // 1) まずトップレベルを parseBlocks して HTML文字列
    const { html: NotionHtml } = parseBlocks(blocks, 0)

    // 2) parse() で React要素化
    const before = parse(NotionHtml)
    setHtml(before)

    // 3) テキスト抽出
    const text = extractTextFromHTML(NotionHtml)
    setTextContent(text)

    // 4) 内部リンク -> BlogCard 差し替え
    //   例: ../api/notion-to-html を叩いて cardDatas を取得
    const res = await fetchAsync({
      url: '../api/notion-to-html',
      options: {
        method: 'POST',
        body: JSON.stringify({ blocks }),
      },
    })
    if (res.status === 200) {
      const responce = await res.json()
      const cardDatas = responce.cardDatas

      // aタグ検出時に差し替え
      const replace = (node: any) => {
        if (node.name === 'a') {
          // 単独で親が <li> ではないならカードに
          if (node.parent?.children?.length === 1 && node.parent.name !== 'li') {
            const indexOfUrl = cardDatas.findIndex((card: any) => {
              return card.url.indexOf(node.attribs?.href) !== -1
            })
            const cardData = cardDatas[indexOfUrl] ? cardDatas[indexOfUrl] : null
            if (cardData === null) {
              return
            }
            const blank = cardData.url.indexOf(process.env.API_DOMAIN as string) === -1
            const blankProp = blank
              ? { target: '_blank', rel: 'noopener nofollow' }
              : {}

            if (cardData.title && cardData.image) {
              return <BlogCard cardData={cardData} blankProp={blankProp} />
            }
            return (
              <a href={cardData.url} {...blankProp}>
                {domToReact(node.children)}
              </a>
            )
          }
          // 通常のリンク
          return (
            <a {...node.attribs} target="_blank" rel="noopener">
              {domToReact(node.children)}
            </a>
          )
        }
      }

      const change = parse(NotionHtml, { replace })
      setHtml(change)
    }
  }

  // ---------------------------
  // マウント時に実行
  // ---------------------------
  useEffect(() => {
    NotionToHtml(blocks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------------------------
  // tocbotで目次生成
  // ---------------------------
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc, .main-toc',
      contentSelector: '.content',
      headingSelector: 'h2, h3',
    })
    return () => tocbot.destroy()
  }, [html])

  // ---------------------------
  // JSX返却
  // ---------------------------
  return (
    <div>
      {!isExcludedPage && <ReadingTime content={textContent} />}
      <section className="content text-gray-800">
        {html}
      </section>
    </div>
  )
}

export default Contents
