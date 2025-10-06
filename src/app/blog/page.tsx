import Link from 'next/link';
import Header from '../../components/header';
import blogStyles from '../../styles/blog.module.css';
import sharedStyles from '../../styles/shared.module.css';
import {
  getBlogLink,
  getDateStr,
  postIsPublished,
} from '../../lib/blog-helpers';
import { getPostsInfos } from '../../lib/notion/client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: '技术博客文章列表',
};

export default async function BlogIndex() {
  const posts: any[] = await getPostsInfos(false);

  return (
    <>
      <Header titlePre="Blog" />

      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>I wanna hacked life.</h1>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.map((post) => {
          return (
            <div className={blogStyles.postPreview} key={post.slug}>
              <h3>
                <span className={blogStyles.titleContainer}>
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </span>
              </h3>
              <div className="authors">By: {post.author}</div>

              {post.date && <div className="posted">Posted: {post.date}</div>}
              <p>
                {(!post.preview || post.preview.length === 0) && '预览不可用'}
                {post.preview}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export const revalidate = 3600; // Revalidate every hour