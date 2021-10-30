import { NextApiRequest, NextApiResponse } from 'next'
// import getPageData from '../../lib/notion/getPageData'
// import getBlogIndex from '../../lib/notion/getBlogIndex'
import { getPostsInfos } from '../../lib/notion/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.query.token !== 'string') {
    return res.status(401).json({ message: 'invalid token' })
  }
  if (req.query.token !== process.env.NOTION_TOKEN) {
    return res.status(404).json({ message: 'not authorized' })
  }

  const postsTable = await getPostsInfos()

  if (!postsTable) {
    return res.status(401).json({ message: 'Failed to fetch posts' })
  }

  res.setPreviewData({})
  res.writeHead(307, { Location: `/blog` })
  res.end()
}
