import { type } from 'os'
import { ParsedUrlQuery } from 'querystring'
import { MouseEventHandler, ReactNode, RefObject } from 'react'

// Page
export type PageType = {
  id: string
  cover?: FileType
  properties: PropertyType
}

export type FileType = {
  file?: {
    url: string
    expiry_time: string
  }
  external?: {
    url: string
  }
}

export type BlogCardData = {
  cardData: cardData
  blankProp: any
}

export type cardData = {
  title: string
  description: string
  url: any
  image: string
}

export type PropertyType = {
  title: {
    title: RichTextType[]
  }
  slug: {
    formula: {
      string: string
    }
  }
  description: {
    rich_text: RichTextType[]
  }
  tags: {
    multi_select: [
      {
        name: string
      },
    ]
  }
  category: {
    select: {
      name: string
    }
  }
  jscategory: {
    formula: {
      string: string
    }
  }
  isPublished: {
    checkbox: boolean
  }
  publishedAt: {
    date: {
      start: string
    }
  }
  update: {
    last_edited_time: string
  }
  text: {
    rich_text: RichTextType[]
  }
  createdAt: {
    created_time: string
  }
}

export type RichTextType = {
  type: string
  text?: {
    content: string
    link: null | {
      url: string
    }
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: null | string
}

export type BlockType = {
  type: string
  heading_2?: {
    is_toggleable: boolean
    color: string
    rich_text: RichTextType[]
  }
  heading_3?: {
    is_toggleable: boolean
    color: string
    rich_text: RichTextType[]
  }
  image?: {
    caption: []
    type: string
    file?: {
      url: string
      expiry_time: Date
    }
    external?: {
      url: string
    }
  }
  paragraph?: {
    rich_text: RichTextType[]
    color: string
  }
  code?: {
    caption: []
    rich_text: RichTextType[]
    language: string
  }
  bulleted_list_item?: {
    rich_text: RichTextType[]
    color: string
    children?: [{ type: string }, { bulleted_list_item: BlockType['bulleted_list_item'] }]
  }
  numbered_list_item?: {
    rich_text: RichTextType[]
    color: string
    children?: [{ type: string }, { numbred_list_item: BlockType['numbered_list_item'] }]
  }
  quote?: {
    rich_text: RichTextType[]
    color: string
    children?: [
      { type?: string },
      {
        quote: BlockType['quote']
      },
    ]
  }
  toggle?: {
    rich_text: RichTextType[]
    color: string
    children?: [
      { type?: string },
      {
        paragraph?: BlockType['paragraph']
      },
    ]
  }
  callout?: {
    rich_text: RichTextType[]
    color: string
    icon?: {
      emoji: string
    }
  }
  video?: {
    caption?: []
    type: string
    file?: {
      url: string
      expiry_time: Date
    }
    external?: {
      url: string
    }
  }
  divider?: {
    type: string
  }
  embed?: {
    url: string
  }
  table?: {
    table_width: number
    has_column_header: boolean
    has_row_header: boolean
  }
  table_row?: {
    cells: any
  }
}

// page

export type IndexProps = {
  pages: PageType[]
}

export type ListProps = {
  page: PageType
  key: number
}

export type PageProps = {
  numberOfPage: number
  page: string
}

export type CategoryProps = IndexProps &
  PageProps & {
    category: string
  }

export type ArticleProps = IndexProps & {
  page: PageType
  blocks: BlockType[]
}

export type NewsProps = PageProps & {
  newsPages: PageType[]
}

export type FrontProps = IndexProps & {
  newsPages: PageType[]
}

export type TagProps = IndexProps & {
  tag: string
}

export type Params = ParsedUrlQuery & {
  category: string
  slug: string
  tag: string
  page: string
  start_cursor: string
}

export type ContentsProps = {
  blocks: BlockType[]
}

export type PaginationProps = {
  numberOfPage: number
  category: string
  current: string
}

export type BreadcrumbProps = {
  breadList: string
  breadListJs: string
}

export type DialogOptions = {
  html?: boolean
  alert?: boolean
  title?: string
  description?: string
  confirmationText?: string
  cancellationText?: string
  onSubmit?: MouseEventHandler<HTMLButtonElement> | undefined
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined
}
