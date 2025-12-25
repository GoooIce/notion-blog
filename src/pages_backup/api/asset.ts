import { NextApiRequest, NextApiResponse } from 'next';
import { getNotionAssetUrl } from '../../lib/notion/client';
import { setHeaders, handleData, handleError } from '../../lib/notion/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (setHeaders(req, res)) return;
  try {
    const { id } = req.query as { [k: string]: string };

    if (!id) {
      handleData(res, {
        status: 'error',
        message: 'asset url or blockId missing',
      });
    } else {
      // we need to re-encode it since it's decoded when added to req.query
      const url = await getNotionAssetUrl(id);
      res.status(307);
      res.setHeader('Location', url);
      res.end();
    }
  } catch (error) {
    // handleError(res, error)
    res.status(307);
    res.setHeader('Location', '/goooice-and-notion.png');
    res.end();
  }
}
