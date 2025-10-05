import { NextApiRequest, NextApiResponse } from 'next';
// import getPageData from '../../lib/notion/getPageData'
// import getBlogIndex from '../../lib/notion/getBlogIndex'
import { getPageData } from '../../lib/notion/client';
import { getBlogLink } from '../../lib/blog-helpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.query.token !== 'string') {
    return res.status(401).json({ message: 'invalid token' });
  }
  if (req.query.token !== process.env.NOTION_TOKEN) {
    return res.status(404).json({ message: 'not authorized' });
  }

  if (typeof req.query.slug !== 'string') {
    return res.status(401).json({ message: 'invalid slug' });
  }
  // const postsTable = await getBlogIndex()
  // const post = postsTable[req.query.slug]
  // console.log(req.query.slug)
  const post_id = req.query.slug?.split('-').pop() || '';
  const post = await getPageData(post_id);

  if (!post) {
    console.log(`Failed to find post for slug: ${req.query.slug}`);
    return res.status(404).json({
      message: `no post found for ${req.query.slug}`,
    });
  }

  if (!post.page_blocks) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  res.setPreviewData({});
  res.writeHead(307, { Location: getBlogLink(post.slug) });
  res.end();
};
