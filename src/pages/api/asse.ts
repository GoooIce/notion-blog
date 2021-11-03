import { NextApiRequest, NextApiResponse } from 'next'
import { getNotionAssetUrl } from '../../lib/notion/client'
import { setHeaders, handleData, handleError } from '../../lib/notion/utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ name: 'w Doddde' })
}
