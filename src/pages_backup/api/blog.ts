import { NextApiRequest, NextApiResponse } from 'next';
import { getPostsInfos } from '../../lib/notion/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const posts = await getPostsInfos(false); // Don't include preview for performance

    // Sort posts by date (newest first)
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.status(200).json({
      posts: sortedPosts,
      total: sortedPosts.length,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      message: 'Failed to fetch posts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
