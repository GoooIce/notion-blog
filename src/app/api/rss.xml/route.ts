import { NextResponse } from 'next/server';
import { getPostsInfos } from '../../../lib/notion/client';

export async function GET() {
  try {
    // Fetch blog posts
    const blogPosts = await getPostsInfos();

    // Sort posts by date (newest first)
    const sortedPosts = blogPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Generate RSS XML
    const rss = generateRSS(sortedPosts);

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    );
  }
}

function generateRSS(posts: any[]) {
  const NOW = new Date().toISOString();
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

  function escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.preview || '')}</description>
    </item>
  `
    )
    .join('');

  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>GoooIce's Notion Blog</title>
    <link>${SITE_URL}</link>
    <description>一个关于技术、生活与思考的个人博客</description>
    <language>zh-CN</language>
    <lastBuildDate>${NOW}</lastBuildDate>
    <generator>Next.js RSS Feed</generator>
    ${items}
  </channel>
</rss>`;
}
