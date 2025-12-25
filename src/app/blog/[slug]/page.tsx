import { notFound } from 'next/navigation';
import { getPageData, getPostsInfos } from '../../../lib/notion/client';
import { getBlogLink } from '../../../lib/blog-helpers';
import BlogPostClient from './BlogPostClient';
import { Metadata } from 'next';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post_id = resolvedParams.slug.split('-').pop();
    const post = await getPageData(post_id);

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    return {
      title: post.title || 'Blog Post',
      description: post.preview || 'A blog post on GoooIce\'s MiantuNet',
      openGraph: {
        title: post.title || 'Blog Post',
        description: post.preview || 'A blog post on GoooIce\'s MiantuNet',
        type: 'article',
        publishedTime: post.date,
        authors: post.author,
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post',
    };
  }
}

export default async function BlogPost({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const post_id = resolvedParams.slug.split('-').pop();
    const post = await getPageData(post_id);

    if (!post) {
      console.log(`Failed to find post for slug: ${resolvedParams.slug}`);
      notFound();
    }

    return <BlogPostClient post={post} />;
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const postsTable = await getPostsInfos(false);

    // Only generate static paths for the first 3 posts to avoid build timeouts
    const limitedPosts = postsTable.slice(0, 3);

    return limitedPosts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const revalidate = 3600; // Revalidate every hour