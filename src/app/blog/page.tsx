import CircuitBlogPage from './components/CircuitBlogPage';
import { getPostsInfos } from '@/lib/notion/client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: '技术博客文章列表',
};

export default async function BlogPage() {
  const posts = await getPostsInfos(false);

  return <CircuitBlogPage posts={posts} />;
}

export const revalidate = 3600;
