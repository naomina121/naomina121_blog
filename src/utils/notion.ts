// 公式のNotionAPIと接続する
import { Client } from '@notionhq/client'
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import { NUMBER_OF_POSTS_PER_PAGE } from '@/constants/constants'

// Notionのシークレットトークンを取得する。
export const notion = new Client({ auth: process.env.NOTION_KEY as string })

const is_public = process.env.NOTION_PUBLIC as string

// 全ての記事を取得
export const allFetchPages = async ({
  category,
  slug,
  exclusion,
  tag,
}: {
  category?: string
  slug?: string
  exclusion?: string
  tag?: string
}) => {
  // 条件定義用 初期設定は公開するものだけフィルタリング
  const and: any = []

  if (is_public === 'public') {
    and.push({
      property: 'isPublished',
      checkbox: {
        equals: true,
      },
    })
  }

  // tagが存在したらそのタグでフィルタリング
  if (tag) {
    and.push({
      property: 'tags',
      multi_select: {
        contains: tag,
      },
    })
  }

  // exclusionが存在したらそのcategoryを除外する
  if (exclusion) {
    and.push({
      property: 'category',
      select: {
        does_not_equal: exclusion,
      },
    })
  }

  // categoryが存在したらそのカテゴリーでフィルタリング
  if (category) {
    and.push({
      property: 'category',
      select: {
        equals: category,
      },
    })
  }

  // slugが存在していたらそのslugでフィルタリング
  if (slug) {
    and.push({
      property: 'slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    })
  }

  // 取得するデータベースのID（＝ページID）を定義する
  let cursor: string | undefined = undefined
  const databaseId = process.env.NOTION_DATABASE_ID as string
  const data = []

  while (true) {
    const { results, next_cursor, has_more }: any = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: and,
      },
      sorts: [
        {
          property: 'update',
          direction: 'descending',
        },
      ],
      start_cursor: cursor,
    })
    data.push(...results)
    // has_moreがfalseになったら終了
    if (!has_more) break
    cursor = next_cursor
  }
  return { results: data }
}

// ページIDからブロックを取得する関数を作成
export const fetchBlocksByPageId = async (pageId: string) => {
  const data = []
  let cursor: string | undefined = undefined
  while (true) {
    const { results, next_cursor }: any = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    })

    // ブロックのhas_childrenがtrueの場合はhas_childrenのブロックを取得する
    for (const block of results) {
      data.push(block)
      if (block.has_children) {
        const { results: children }: any = await fetchBlocksByPageId(block.id)
        data.push(...children)
      }
    }

    // has_moreがfalseになったら終了
    if (!next_cursor) break
    cursor = next_cursor
  }
  return { results: data }
}

// ページ番号に応じた記事取得
export const getPostsByPage = async ({
  pageNumber,
  allPosts,
}: {
  pageNumber: number
  allPosts: any
}) => {
  const start = (pageNumber - 1) * NUMBER_OF_POSTS_PER_PAGE
  const end = start + NUMBER_OF_POSTS_PER_PAGE
  return allPosts.slice(start, end)
}

// ページ数を取得
export const getNumberOfPages = async (allPosts: any) => {
  return (
    Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) +
    (allPosts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)
  )
}
