import { getPostsInfos } from '../../lib/notion/client';
import { Metadata } from 'next';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: '技术博客文章列表',
};

export default async function BlogIndex() {
  const posts: any[] = await getPostsInfos(false);

  return <BlogListClient posts={posts} />;
}

export const revalidate = 3600; // Revalidate every hour