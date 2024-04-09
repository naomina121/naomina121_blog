import parse, { domToReact } from 'html-react-parser'
import React, { FC, useEffect, useState } from 'react'
import tocbot from 'tocbot'
import BlogCard from './BlogCard'
import { BlockType, ContentsProps, RichTextType } from '@/types'

interface FetchRequest {
  url: string
  options: object
}

async function fetchAsync(request: FetchRequest) {
  return await fetch(request.url, request.options)
}

const Contents: FC<ContentsProps> = ({ blocks }) => {
  const [html, setHtml] = useState(
    parse('<p>只今、記事の読み込み中です。恐れ入りますが今しばらくお待ちください</p>'),
  )

  const NotionToHtml = async (blocks: BlockType[]) => {
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

    // rech_text以下の装飾のスタイリングの追加 typeがtext以外はスキップ。
    const RichTextStyling = (contents: RichTextType[] | undefined) => {
      const Styling: string[] = []
      if (contents === undefined) {
        return ' '
      }
      contents.map((content, i) => {
        const text = content.plain_text
        const link = content.text?.link
        if (text === ' ') {
          return []
        }
        if (content.type === 'text') {
          if (content.href !== null) {
            if (content.annotations) {
              if (content.annotations.strikethrough) {
                Styling.push(
                  `<a class='text-blue-600 hover:opacity-80' href="${
                    content.href
                  }" target="target_blank" class="${content.annotations.bold ? 'font-bold ' : ''}${
                    content.annotations.italic ? 'italic ' : ''
                  }${
                    content.annotations.underline ? 'underline decoration-1' : ''
                  }" ><s>${text}</s></a>`,
                )
              } else {
                Styling.push(
                  `<a class='text-blue-600 hover:opacity-80 ${
                    content.annotations.bold ? 'font-bold ' : ''
                  }${content.annotations.italic ? 'italic ' : ''}${
                    content.annotations.underline ? 'underline decoration-1' : ''
                  }' href="${content.href}" target="target_blank">${text}</a>`,
                )
              }
            }
          } else {
            if (content.annotations) {
              if (content.annotations.strikethrough) {
                Styling.push(
                  `<s class="${content.annotations.bold ? 'font-bold ' : ''}${
                    content.annotations.italic ? 'italic ' : ''
                  }${content.annotations.underline ? 'underline decoration-1 ' : ''}${
                    content.annotations.color ? content.annotations.color : ''
                  }">${text}</s>`,
                )
              } else if (link) {
                Styling.push(`<a href="${link.url})${text}</a>`)
              } else {
                Styling.push(
                  `<span class="${content.annotations.bold ? 'font-bold ' : ''}${
                    content.annotations.italic ? 'italic ' : ''
                  }${content.annotations.underline ? 'underline decoration-1 ' : ''}
                ${content.annotations.color ? content.annotations.color : ''}">${text}</span>`,
                )
              }
            } else {
              Styling.push(`${text}`)
            }
          }
        }
        return Styling
      })
      const Join = Styling.join('')
      return Join
    }

    const CellsTextStyling = (contents: RichTextType[] | undefined) => {
      const Styling: string[] = []
      if (contents === undefined) {
        return ' '
      }
      contents.map((content, i) => {
        const text = content.plain_text
        const link = content.text?.link
        if (text === ' ') {
          return []
        }
        if (content.type === 'text') {
          if (content.href !== null) {
            if (content.annotations) {
              if (content.annotations.strikethrough) {
                Styling.push(
                  `<td class="p-1 border border-gray-200"><a class='text-blue-600 hover:opacity-80' href="${
                    content.href
                  }" target="target_blank" class="${content.annotations.bold ? 'font-bold ' : ''}${
                    content.annotations.italic ? 'italic ' : ''
                  }${
                    content.annotations.underline ? 'underline decoration-1' : ''
                  }" ><s>${text}</s></a></td>`,
                )
              } else {
                Styling.push(
                  `<td class="p-1 border border-gray-200"><a class='text-blue-600 hover:opacity-80 ${
                    content.annotations.bold ? 'font-bold ' : ''
                  }${content.annotations.italic ? 'italic ' : ''}${
                    content.annotations.underline ? 'underline decoration-1' : ''
                  }' href="${content.href}" target="target_blank">${text}</a></td>`,
                )
              }
            }
          } else {
            if (content.annotations) {
              if (content.annotations.strikethrough) {
                Styling.push(
                  `<td class="p-1 border border-gray-200"><s class="${
                    content.annotations.bold ? 'font-bold ' : ''
                  }${content.annotations.italic ? 'italic ' : ''}${
                    content.annotations.underline ? 'underline decoration-1 ' : ''
                  }">${content.annotations.color ? content.annotations.color : ''}${text}</s></td>`,
                )
              } else if (link) {
                Styling.push(`<a href="${link.url})${text}</a>`)
              } else {
                Styling.push(
                  `<td class="p-1 border border-gray-200"><span class="${
                    content.annotations.bold ? 'font-bold ' : ''
                  }${content.annotations.italic ? 'italic ' : ''}${
                    content.annotations.underline ? 'underline decoration-1 ' : ''
                  }
                    ${
                      content.annotations.color ? content.annotations.color : ''
                    }">${text}</span></td>`,
                )
              }
            } else {
              Styling.push(`<td class="p-1 border border-gray-200">${text}</td>`)
            }
          }
        }
        return Styling
      })
      const Join = Styling.join('')
      return Join
    }

    //ブロックタイプをHTMLに変換する
    const NotionBlockToTag = (block: BlockType) => {
      if (block.type == 'heading_2') {
        return `<h2 class='my-6 bg-emerald-100 p-3 text-2xl text-gray-700' id="${
          block.heading_2?.rich_text[0].plain_text
        }">${RichTextStyling(block.heading_2?.rich_text)}</h2>`
      }
      if (block.type === 'heading_3') {
        return `<h3 class='my-6 border-b-2 border-solid py-3 text-xl text-gray-600' id="${
          block.heading_3?.rich_text[0].plain_text
        }">${RichTextStyling(block.heading_3?.rich_text)}</h3>`
      }
      if (block.type === 'paragraph') {
        if (!RichTextStyling(block.paragraph?.rich_text)) {
          return
        }
        return `<p>${RichTextStyling(block.paragraph?.rich_text)}</p>`
      }
      if (block.type === 'bulleted_list_item') {
        return `<li class='mb-2 ml-4'>${RichTextStyling(block.bulleted_list_item?.rich_text)}</li>`
      }
      if (block.type === 'numbered_list_item') {
        return `<li class='mb-2 ml-7'>${RichTextStyling(block.numbered_list_item?.rich_text)}</li>`
      }
      if (block.type === 'callout') {
        return `<div class='my-6 ${block.callout?.color} border-l-4 p-4' role='alert'><span>${
          block.callout?.icon?.emoji
        }</span>${RichTextStyling(block.callout?.rich_text)}</div>`
      }
      if (block.type === 'video') {
        return `<div class='my-6'><iframe width="480" height="270" class='w-full' src="${block.video?.external?.url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
      }
      if (block.type === 'embed') {
        return `<div class='my-6'>
      <iframe style="border-radius:12px" src="${block.embed?.url}" width="100%"  frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
      </div>`
      }
      if (block.type === 'divider') {
        return `<div class='my-6'><hr class='border-gray-200'></div>`
      }
      if (block.type === 'image') {
        const src = block.image?.file ? block.image?.file?.url : block.image?.external?.url
        const alt = block.image?.caption ? block.image?.caption : ''
        return `<img class='my-6 inline-block' src="${src}" alt="${alt}" />`
      }
      if (block.type === 'quote') {
        return `
      <blockquote class="text-base bg-gray-100 p-4 italic font-semibold text-gray-900">
      <svg class="w-6 h-6 text-gray-400 mb-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
          <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
      </svg>
      <span class="p-2 mb-1 inline-block">${RichTextStyling(block.quote?.rich_text)}</span>
  </blockquote>
      `
      }
    }

    //最終的にblocksをHTMLに変換する関数
    const NotionBlocksToHtml = (blocks: BlockType[]) => {
      // 出力するHTMLをフィルターにかける。
      const BlocksFilter = blocks.filter((block: any) => {
        return BlockTypeArray.find((value) => value === block.type)
      })

      // HTMLを連結させて最終的に一つのHTMLとして出力させるための配列
      const HtmlArray: any[] = []
      // Ul要素を判別するための配列
      let UlArray: any[] = []
      // OL要素を判別するための配列
      let OlArray: any[] = []
      // Table要素を判別するための配列
      let TableArray: any[] = []
      // Table要素の中のth要素を判別するためのboolean
      let TableHeaderTh = false
      let TableRowsTh = false
      let TableWidth = 0

      BlocksFilter.map((block: BlockType, index: number) => {
        let add: any = ''
        if (block.type !== 'table_row') {
          add = NotionBlockToTag(block)
        }

        if (block.type === 'bulleted_list_item') {
          if (UlArray.length === 0) {
            UlArray.push('<ul class="list-disc my-6">')
            UlArray.push(add)
          } else {
            UlArray.push(add)
          }
        }

        if (block.type === 'numbered_list_item') {
          if (OlArray.length === 0) {
            OlArray.push('<ol class="list-decimal my-6">')
            OlArray.push(add)
          } else {
            OlArray.push(add)
          }
        }

        if (block.type === 'table') {
          if (TableArray.length === 0) {
            TableArray.push(`<table class="my-6">`)
            if (block.table?.has_column_header) {
              TableHeaderTh = true
            }
            if (block.table?.has_row_header) {
              TableRowsTh = true
            }
            if (block.table?.table_width) {
              TableWidth = block.table.table_width
            }
          }
        }

        if (block.type === 'table_row') {
          if (TableHeaderTh) {
            if (TableArray.length === 1) {
              TableArray.push('<thead>')
              TableArray.push('<tr>')

              for (let table_width = 0; table_width < TableWidth; table_width++) {
                TableArray.push('<th class="bg-gray-100 text-left p-1 border border-gray-200">')
                if (block.table_row?.cells[table_width] !== undefined) {
                  TableArray.push(`${RichTextStyling(block.table_row?.cells[table_width])}`)
                }
                TableArray.push('</th>')
              }

              TableArray.push('</tr>')
              TableArray.push('</thead>')
            } else {
              TableArray.push('<tr>')
              for (let table_width = 0; table_width < TableWidth; table_width++) {
                TableArray.push(CellsTextStyling(block.table_row?.cells[table_width]))
              }
              TableArray.push('</tr>')
            }
          } else if (TableRowsTh) {
            TableArray.push('<tr>')
            for (let table_width = 0; table_width < TableWidth; table_width++) {
              if (table_width === 0) {
                TableArray.push('<th class="bg-gray-100 border border-gray-200">')
                TableArray.push(RichTextStyling(block.table_row?.cells[table_width]))
                TableArray.push('</th>')
              } else {
                TableArray.push(CellsTextStyling(block.table_row?.cells[table_width]))
              }
            }
            TableArray.push('</tr>')
          } else {
            TableArray.push('<tr>')
            for (let table_width = 0; table_width < TableWidth; table_width++) {
              TableArray.push(CellsTextStyling(block.table_row?.cells[table_width]))
            }
            TableArray.push('</tr>')
          }
        }

        if (block.type !== 'numbered_list_item' && OlArray.length > 0) {
          OlArray.push('</ol>')
          const ol = ([...OlArray] = OlArray)
          const ol_string = ol.join('')
          HtmlArray.push(ol_string)
          OlArray = []
        } else if (block.type !== 'bulleted_list_item' && UlArray.length > 0) {
          UlArray.push('</ul>')
          const ul = ([...UlArray] = UlArray)
          const ul_string = ul.join('')
          HtmlArray.push(ul_string)
          UlArray = []
        } else if (block.type !== 'table_row' && TableArray.length > 1) {
          TableArray.push('</table>')
          const table = ([...TableArray] = TableArray)
          const table_string = table.join('')
          HtmlArray.push(table_string)
          TableArray = []
        } else if (index === BlocksFilter.length - 1) {
          //配列の一番最後でもリスト要素が残っていた場合の処理
          if (OlArray.length > 0) {
            OlArray.push('</ol>')
            const ol = ([...OlArray] = OlArray)
            const ol_string = ol.join('')
            HtmlArray.push(ol_string)
            OlArray = []
          } else if (UlArray.length > 0) {
            UlArray.push('</ul>')
            const ul = ([...UlArray] = UlArray)
            const ul_string = ul.join('')
            HtmlArray.push(ul_string)
            UlArray = []
          } else if (TableArray.length > 1) {
            TableArray.push('</table>')
            const table = ([...TableArray] = TableArray)
            const table_string = table.join('')
            HtmlArray.push(table_string)
            TableArray = []
          }
        } else if (block.type !== 'numbered_list_item' && block.type !== 'bulleted_list_item') {
          HtmlArray.push(add)
        }

        return HtmlArray
      })

      const html = HtmlArray.join(' ')
      return html
    }

    const NotionHtml = NotionBlocksToHtml(blocks)

    const before = parse(NotionHtml)

    setHtml(before)

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

      const replace = (node: any) => {
        if (node.name === 'a') {
          if (node.parent.children.length === 1 && node.parent.name !== 'li') {
            const indexOfUrl = cardDatas.findIndex((card: any) => {
              return card.url.indexOf(node.attribs?.href) != -1
            })
            const cardData = cardDatas[indexOfUrl] ? cardDatas[indexOfUrl] : null

            if (cardData === null) {
              return
            }

            //内部リンクか外部リンク化判定
            const blank = cardData.url.indexOf(process.env.API_DOMAIN as String) === -1
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
            <a {...node.attribs} target='_blank'>
              {domToReact(node.children)}
            </a>
          )
        }
      }

      const change = parse(NotionHtml, { replace })

      setHtml(change)
      return
    }
  }

  useEffect(() => {
    NotionToHtml(blocks)
  }, [])

  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc, .main-toc',
      contentSelector: '.content',
      headingSelector: 'h2, h3',
    })
    return () => tocbot.destroy()
  }, [html])

  return <section className='text-gray-800'>{html}</section>
}

export default Contents
