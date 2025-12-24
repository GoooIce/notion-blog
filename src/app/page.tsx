import CircuitHomePage from './components/CircuitHomePage';
import { getPostsInfos } from '../lib/notion/client';

export default async function Index() {
  let recentPosts: any[] = [];

  try {
    const posts = await getPostsInfos(false);
    recentPosts = posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch recent posts:', error);
  }

  return <CircuitHomePage recentPosts={recentPosts} />;
}

export const revalidate = 3600;
