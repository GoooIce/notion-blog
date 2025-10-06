import Header from '../components/header';
import ExtLink from '../components/ext-link';
import Features from '../components/features';
import SmoothScroll from '../components/smooth-scroll';
import Image from 'next/image';
import Link from 'next/link';
import { getPostsInfos } from '../lib/notion/client';
import sharedStyles from '../styles/shared.module.css';
import styles from '../styles/home.module.css';
import ClientHomePage from './components/ClientHomePage';

export default async function Index() {
  // Server-side data fetching for recent posts
  let recentPosts: any[] = [];

  try {
    const posts = await getPostsInfos(false); // Don't include preview for performance
    // Sort posts by date (newest first) and take latest 3
    recentPosts = posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch recent posts:', error);
  }

  return (
    <ClientHomePage recentPosts={recentPosts} />
  );
}

export const revalidate = 3600; // Revalidate every hour