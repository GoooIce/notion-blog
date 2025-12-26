import { NextResponse } from 'next/server';
import { getPostsInfos } from '../../../lib/notion/client';

export async function GET() {
  try {
    const posts = await getPostsInfos(false); // Don't include preview for performance

    // Sort posts by date (newest first)
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      posts: sortedPosts,
      total: sortedPosts.length,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch posts',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
