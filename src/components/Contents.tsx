import parse, { domToReact } from 'html-react-parser'
import React, { FC, useEffect, useState } from 'react'
import tocbot from 'tocbot'
import BlogCard from './BlogCard'
import { BlockType, ContentsProps, RichTextType } from '@/types'
import ReadingTime from '@/components/ReadingTime';
import { Html } from 'next/document'
import { useRouter } from 'next/router';

interface FetchRequest {
  url: string
  options: object
}

async function fetchAsync(request: FetchRequest) {
  return await fetch(request.url, request.options)
}

// ---------------------
// HTML→テキスト抽出
// ---------------------
export const extractTextFromHTML = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || '';
};

// ==================================================================
// RichTextをHTML文字列化（既存の装飾ロジックを流用）
// ==================================================================
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

// ==================================================================
// テーブルのセル用：RichTextをHTML文字列化
// ==================================================================
const CellsTextStyling = (contents: RichTextType[] | undefined) => {
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

// ==================================================================
// Notionのブロック配列をHTML文字列に変換する（再帰的）
// ==================================================================
function NotionBlocksToHtml(blocks: BlockType[]): string {
  // まとめて処理するために一度 フィルタリング
  const BlockTypeArray: string[] = [
    'heading_2',
    'heading_3',
    'image',
    'paragraph',
    'bulleted_list_item',
    'numbered_list_item',
    'quote',
    'table',
    'table_row',
    'video',
    'embed',
    'callout',
    'divider',
  ]

  // 対象外タイプはスキップ
  const filteredBlocks = blocks.filter((block) => {
    return BlockTypeArray.includes(block.type)
  })

  // HTMLを連結させるための配列
  const HtmlArray: string[] = []

  // リストとテーブルの暫定バッファ
  let UlArray: string[] = []
  let OlArray: string[] = []
  let TableArray: string[] = []
  // テーブルヘッダ等のフラグ
  let TableHeaderTh = false
  let TableRowsTh = false
  let TableWidth = 0

  // --------------------------------------------------------
  // ブロックを一つずつ走査しつつ、連続するリストやテーブルをまとめて処理
  // --------------------------------------------------------
  filteredBlocks.forEach((block, index) => {
    // 各ブロックをHTMLにする
    const addBlockHtml = renderBlock(block)

    // ------------------------------
    // リスト(bulleted / numbered)
    // ------------------------------
    if (block.type === 'bulleted_list_item') {
      if (UlArray.length === 0) {
        // 新規で ul 開始
        UlArray.push('<ul class="list-disc my-6">')
      }
      let liHtml = `<li class="mb-2 ml-4">${RichTextStyling(block.bulleted_list_item?.rich_text)}`

      // 子ブロックがあれば再帰呼び出し
      if (block.has_children && block.children && block.children.length > 0) {
        liHtml += NotionBlocksToHtml(block.children)
      }
      liHtml += `</li>`
      UlArray.push(liHtml)

    } else if (block.type === 'numbered_list_item') {
      if (OlArray.length === 0) {
        // 新規で ol 開始
        OlArray.push('<ol class="list-decimal my-6">')
      }
      let liHtml = `<li class="mb-2 ml-4">${RichTextStyling(block.numbered_list_item?.rich_text)}`

      // 子ブロックがあれば再帰呼び出し
      if (block.has_children && block.children && block.children.length > 0) {
        liHtml += NotionBlocksToHtml(block.children)
      }
      liHtml += `</li>`
      OlArray.push(liHtml)

    }
    // ------------------------------
    // テーブル
    // ------------------------------
    else if (block.type === 'table') {
      // テーブル開始（連続する table_row が続く想定）
      if (TableArray.length === 0) {
        TableArray.push('<table class="my-6 w-full border-collapse border border-gray-200">')
        if (block.table?.has_column_header) {
          TableHeaderTh = true
        }
        if (block.table?.has_row_header) {
          TableRowsTh = true
        }
        if (block.table?.table_width) {
          TableWidth = block.table.table_width
        }
      } else {
        // もし tableArray にすでにテーブルが始まっていたら、ここで特に処理なし
        // (Notion で連続してテーブルが現れるケースは稀なので想定外かもしれません)
      }
    } else if (block.type === 'table_row') {
      // テーブル行を tableArray に追記
      if (TableArray.length === 0) {
        // いきなり table_row がきたら、新規で table 開始
        TableArray.push('<table class="my-6 w-full border-collapse border border-gray-200">')
      }

      // まだ thead が作られていない & has_column_header が true => 最初の行は thead 扱い
      if (TableHeaderTh && TableArray.indexOf('<thead>') === -1) {
        // thead 未作成 => ここで thead 開始
        TableArray.push('<thead>')
        TableArray.push('<tr>')
        for (let c = 0; c < TableWidth; c++) {
          TableArray.push('<th class="bg-gray-100 text-left p-1 border border-gray-200">')
          if (block.table_row?.cells[c] !== undefined) {
            TableArray.push(RichTextStyling(block.table_row?.cells[c]))
          }
          TableArray.push('</th>')
        }
        TableArray.push('</tr>')
        TableArray.push('</thead>')
      } else {
        // thead 済 or has_column_header = false
        // tbody開始がまだなら開始
        if (TableArray.indexOf('<tbody>') === -1) {
          TableArray.push('<tbody>')
        }
        TableArray.push('<tr>')
        for (let c = 0; c < TableWidth; c++) {
          // has_row_header = true なら最初の列を <th> に
          if (TableRowsTh && c === 0) {
            TableArray.push('<th class="bg-gray-100 p-1 border border-gray-200">')
            if (block.table_row?.cells[c] !== undefined) {
              TableArray.push(RichTextStyling(block.table_row?.cells[c]))
            }
            TableArray.push('</th>')
          } else {
            TableArray.push('<td class="p-1 border border-gray-200">')
            if (block.table_row?.cells[c] !== undefined) {
              TableArray.push(CellsTextStyling(block.table_row?.cells[c]))
            }
            TableArray.push('</td>')
          }
        }
        TableArray.push('</tr>')
      }

    }
    // ------------------------------
    // ここから下は「リストでもテーブルでもない通常ブロック」
    // ------------------------------
    else {
      // 直前までリスト(UL/OL) 処理中なら閉じる
      if (UlArray.length > 0) {
        UlArray.push('</ul>')
        HtmlArray.push(UlArray.join(''))
        UlArray = []
      } else if (OlArray.length > 0) {
        OlArray.push('</ol>')
        HtmlArray.push(OlArray.join(''))
        OlArray = []
      }

      // 直前までテーブル処理中なら閉じる
      if (TableArray.length > 0) {
        // thead / tbody が始まってる場合はちゃんと閉じる
        if (TableArray.indexOf('<tbody>') !== -1) {
          TableArray.push('</tbody>')
        }
        TableArray.push('</table>')
        HtmlArray.push(TableArray.join(''))
        TableArray = []
        TableHeaderTh = false
        TableRowsTh = false
        TableWidth = 0
      }

      // 通常ブロックを追加
      if (addBlockHtml) {
        HtmlArray.push(addBlockHtml)
      }
    }

    // --------------------------------------------------------
    // forEach最後の要素に来たとき、まだリストorテーブルが残っていれば閉じる
    // --------------------------------------------------------
    if (index === filteredBlocks.length - 1) {
      // リストが残っていれば閉じる
      if (UlArray.length > 0) {
        UlArray.push('</ul>')
        HtmlArray.push(UlArray.join(''))
        UlArray = []
      } else if (OlArray.length > 0) {
        OlArray.push('</ol>')
        HtmlArray.push(OlArray.join(''))
        OlArray = []
      }
      // テーブルが残っていれば閉じる
      if (TableArray.length > 0) {
        if (TableArray.indexOf('<tbody>') !== -1) {
          TableArray.push('</tbody>')
        }
        TableArray.push('</table>')
        HtmlArray.push(TableArray.join(''))
        TableArray = []
      }
    }
  })

  return HtmlArray.join('')
}

// ==================================================================
// 各ブロックをHTMLに変換する (リスト/テーブル以外)
// ==================================================================
function renderBlock(block: BlockType): string {
  switch (block.type) {
    case 'heading_2':
      return `<h2 class="my-6 bg-emerald-100 p-3 text-2xl text-gray-700" id="${
        block.heading_2?.rich_text[0]?.plain_text || ''
      }">${RichTextStyling(block.heading_2?.rich_text)}</h2>`

    case 'heading_3':
      return `<h3 class="my-6 border-b-2 border-solid py-3 text-xl text-gray-600" id="${
        block.heading_3?.rich_text[0]?.plain_text || ''
      }">${RichTextStyling(block.heading_3?.rich_text)}</h3>`

    case 'paragraph':
      if (!block.paragraph?.rich_text || block.paragraph.rich_text.length === 0) {
        return ''
      }
      return `<p>${RichTextStyling(block.paragraph?.rich_text)}</p>`

    case 'quote':
      return `
<blockquote class="text-base bg-gray-100 p-4 italic font-semibold text-gray-900">
  <svg class="w-6 h-6 text-gray-400 mb-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
      <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
  </svg>
  <span class="p-2 mb-1 inline-block">${RichTextStyling(block.quote?.rich_text)}</span>
</blockquote>
      `

    case 'callout':
      return `
<div class="my-6 ${block.callout?.color || ''} border-l-4 p-4" role='alert'>
  <span>${block.callout?.icon?.emoji || ''}</span>
  ${RichTextStyling(block.callout?.rich_text)}
</div>`

    case 'divider':
      return `<div class="my-6"><hr class="border-gray-200" /></div>`

    case 'image':
      {
        const src = block.image?.file ? block.image.file.url : block.image?.external?.url
        const alt = block.image?.caption ? block.image.caption[0]?.plain_text || '' : ''
        return `<img class="my-6 inline-block" src="${src}" alt="${alt}" />`
      }

    case 'video':
      return `<div class="my-6">
        <iframe class="w-full youtube-16-9" src="${block.video?.external?.url}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>`

    case 'embed':
      return `<div class="my-6">
        <iframe style="border-radius:12px" src="${block.embed?.url}"
          width="100%" class="youtube-16-9"
          frameBorder="0" allowfullscreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
        </iframe>
      </div>`

    // テーブルとリストは上位でまとめているためここでは空
    case 'table':
    case 'table_row':
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return ''

    default:
      return ''
  }
}

// ==================================================================
// メインのContentsコンポーネント
// ==================================================================
const Contents: FC<ContentsProps> = ({ blocks }) => {
  const [html, setHtml] = useState(
    parse('<p>只今、記事の読み込み中です。恐れ入りますが今しばらくお待ちください</p>'),
  )
  const [textContent, setTextContent] = useState<string>('');
  const router = useRouter();

  // -------------------------------
  // NotionブロックをHTMLに変換
  // -------------------------------
  const NotionToHtml = async (blocks: BlockType[]) => {
    // 1) 再帰パースでHTML文字列へ
    const NotionHtml = NotionBlocksToHtml(blocks)

    // 2) parse() で React要素化
    const before = parse(NotionHtml)
    setHtml(before)

    // 3) テキスト抽出（読み時間表示などで使用）
    const text = extractTextFromHTML(NotionHtml)
    setTextContent(text)

    // 4) リンクカード差し替え (BlogCard) のためのAPI呼び出し
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

      // aタグを見つけたらカードに差し替える
      const replace = (node: any) => {
        if (node.name === 'a') {
          // 親が <li> でないかつ、そのaタグが1つしかない場合 → カード
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
              ? {
                  target: '_blank',
                  rel: 'noopener nofollow',
                }
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

  // -------------------------------
  // マウント時にブロックをHTML化
  // -------------------------------
  useEffect(() => {
    NotionToHtml(blocks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -------------------------------
  // 目次生成
  // -------------------------------
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc, .main-toc',
      contentSelector: '.content',
      headingSelector: 'h2, h3',
    })
    return () => tocbot.destroy()
  }, [html])

  // 特定ページで読み時間を非表示にするかの判定
  const isExcludedPage =
    router.pathname === '/news-list/[slug]' || router.asPath.startsWith('/news-list/');

  return (
    <div>
      {!isExcludedPage && <ReadingTime content={textContent} />}
      <section className="content text-gray-800">{html}</section>
    </div>
  );
};

export default Contents;
