'use client';

import Link from 'next/link';
import Header from '../../../components/header';
import Heading from '../../../components/heading';
import components from '../../../components/dynamic';
import ReactJSXParser from 'react-jsx-parser';
import blogStyles from '../../../styles/blog.module.css';
import { textBlock } from '../../../lib/notion/renderers';
import React, { CSSProperties, useEffect } from 'react';
import { getBlogLink } from '../../../lib/blog-helpers';
import { useRouter } from 'next/navigation';

interface BlogPostClientProps {
  post: any;
  redirect?: string;
  preview?: boolean;
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ post, redirect, preview }) => {
  const router = useRouter();

  let listTagName: string | null = null;
  let listLastId: string | null = null;
  let listMap: {
    [id: string]: {
      key: string;
      isNested?: boolean;
      nested: string[];
      children: React.ReactNode;
    };
  } = {};

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect);
    }
  }, [redirect, post, router]);

  // If the page is not yet generated, this will be displayed
  // initially until the server component finishes loading
  if (!post) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! didn&apos;t find that post, redirecting you back to the blog
          index
        </p>
      </div>
    );
  }

  return (
    <>
      <Header titlePre={post.title} />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview?slug=${post.Slug}`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={blogStyles.post}>
        <h1>{post.title || ''}</h1>
        {post.author.length > 0 && (
          <div className="authors">By: {post.author}</div>
        )}
        {post.date && <div className="posted">Posted: {post.date}</div>}

        <hr />

        {(!post.page_blocks || post.page_blocks.length === 0) && (
          <p>This post has no content</p>
        )}

        {(post.page_blocks || []).map((block, blockIdx) => {
          const id = block.id;
          const type = block.type;
          const properties = block[type];

          let toRender: React.ReactNode[] = [];

          const renderHeading = (Type: string | React.ComponentType) => {
            toRender.push(
              <Heading key={id}>
                <Type key={id}>{textBlock(properties.text, true, id)}</Type>
              </Heading>
            );
          };

          const renderBookmark = ({ link, title, description, format }: any) => {
            const { bookmark_icon: icon, bookmark_cover: cover } = format;
            toRender.push(
              <div className={blogStyles.bookmark}>
                <div>
                  <div style={{ display: 'flex' }}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className={blogStyles.bookmarkContentsWrapper}
                      href={link}
                    >
                      <div
                        role="button"
                        className={blogStyles.bookmarkContents}
                      >
                        <div className={blogStyles.bookmarkInfo}>
                          <div className={blogStyles.bookmarkTitle}>
                            {title}
                          </div>
                          <div className={blogStyles.bookmarkDescription}>
                            {description}
                          </div>
                          <div className={blogStyles.bookmarkLinkWrapper}>
                            <img
                              src={icon}
                              className={blogStyles.bookmarkLinkIcon}
                            />
                            <div className={blogStyles.bookmarkLink}>
                              {link}
                            </div>
                          </div>
                        </div>
                        <div className={blogStyles.bookmarkCoverWrapper1}>
                          <div className={blogStyles.bookmarkCoverWrapper2}>
                            <div className={blogStyles.bookmarkCoverWrapper3}>
                              <img
                                src={cover}
                                className={blogStyles.bookmarkCover}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            );
          };

          const listTypes = new Set(['bulleted_list', 'numbered_list']);

          switch (type) {
            case 'page':
            case 'divider':
              break;
            case 'text': {
              if (properties) {
                toRender.push(textBlock(properties.text, false, id));
              }
              break;
            }
            case 'paragraph': {
              if (properties && properties.rich_text) {
                toRender.push(
                  <p key={id}>
                    {properties.rich_text.length
                      ? properties.rich_text[0].plain_text
                      : ''}
                  </p>
                );
              }
              break;
            }
            case 'image':
            case 'video': {
              const isImage = type === 'image';
              const Comp = isImage ? 'img' : 'video';
              toRender.push(
                <Comp
                  key={id}
                  src={`/api/asset?id=${id}`}
                  loop={!isImage}
                  muted={!isImage}
                  alt={`An ${isImage ? 'image' : 'video'} from Notion`}
                  controls={!isImage}
                  autoPlay={!isImage}
                />
              );
              break;
            }
            case 'embed':
              break;
            case 'heading_1':
              renderHeading('h1');
              break;
            case 'heading_2':
              renderHeading('h2');
              break;
            case 'heading_3':
              renderHeading('h3');
              break;
            case 'bulleted_list':
            case 'numbered_list': {
              const listType = type === 'bulleted_list' ? 'ul' : 'ol';
              const plainText = properties?.rich_text?.[0]?.plain_text || '';

              toRender.push(
                <li key={id}>{plainText}</li>
              );
              break;
            }
            case 'quote': {
              if (properties && properties.rich_text) {
                toRender.push(
                  <blockquote key={id}>
                    {properties.rich_text.length
                      ? properties.rich_text[0].plain_text
                      : ''}
                  </blockquote>
                );
              }
              break;
            }
            case 'code': {
              if (properties && properties.rich_text) {
                const language = properties.language || '';
                const code = properties.rich_text[0]?.plain_text || '';

                toRender.push(
                  <pre key={id}>
                    <code className={`language-${language}`}>
                      {code}
                    </code>
                  </pre>
                );
              }
              break;
            }
            default:
              // Handle unknown block types
              console.log(`Unknown block type: ${type}`);
              break;
          }

          return toRender;
        })}
      </div>
    </>
  );
};

export default BlogPostClient;