import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<any | string>) => {
  const path = req.query.path

  if (!path) return res.status(404).json({ message: 'Not Found' })

  try {
    await res.revalidate(`${path}`)
    return res.status(200).json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}

export default handler
