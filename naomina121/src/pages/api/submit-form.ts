import { Client } from '@notionhq/client'

import type { NextApiRequest, NextApiResponse } from 'next'
// Initializing a client (https://www.npmjs.com/package/@notionhq/client)
export const contact_notion = new Client({
  auth: process.env.NOTION_CONTACT_KEY as string,
})

const CONTACT_DATABASE_ID = process.env.NOTION_CONTACT_DATABASE_ID as string

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: `${req.method} requests are not allowed（許可されていないリクエストです）`,
    })
  }

  try {
    const { name, email, message } = JSON.parse(req.body)
    await contact_notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: CONTACT_DATABASE_ID,
      },
      properties: {
        名前: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        メールアドレス: {
          email: email,
        },
      },
      children: [
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: message,
                },
              },
            ],
          },
        },
      ],
    })
    res.status(201).json({ msg: 'Success' })
  } catch (error) {
    res.status(500).json({ msg: '何らかのエラーが生じたようです。' })
  }
}
