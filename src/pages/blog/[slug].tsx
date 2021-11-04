import Link from 'next/link'
// import Image from 'next/image'
// import fetch from 'node-fetch'
import { useRouter } from 'next/router'
import Header from '../../components/header'
import Heading from '../../components/heading'
import components from '../../components/dynamic'
import ReactJSXParser from '@zeit/react-jsx-parser'
import blogStyles from '../../styles/blog.module.css'
import { textBlock } from '../../lib/notion/renderers'
import { getPageData, getPostsInfos } from '../../lib/notion/client'
// import { getUrl } from '../../lib/qiniu'
import React, { CSSProperties, useEffect } from 'react'
// import getBlogIndex from '../../lib/notion/getBlogIndex'
// import getNotionUsers from '../../lib/notion/getNotionUsers'
import { getBlogLink, getDateStr } from '../../lib/blog-helpers'

// Get the data for each blog post
export async function getStaticProps({ params: { slug }, preview }) {
  // load the postsTable so that we can get the page's ID
  // const postsTable = await getBlogIndex()
  if (typeof slug != 'string') {
    for (const [key, value] of Object.entries(slug)) {
      console.log(`${key}: ${value}`)
    }
  }
  const post_id = slug.split('-').pop()
  // console.log(post_id, '---', slug, '===========')
  const post = await getPageData(post_id)
  // const post = []

  // if we can't find the post or if it is unpublished and
  // viewed without preview mode then we just redirect to /blog
  if (!post) {
    console.log(`Failed to find post for slug: ${slug}`)
    return {
      props: {
        redirect: '/blog',
        preview: false,
      },
      unstable_revalidate: 5,
    }
  }

  return {
    props: {
      post,
      preview: preview || false,
    },
    revalidate: 10,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const postsTable = await getPostsInfos(false)
  // we fallback for any unpublished posts to save build time
  // for actually published ones
  // postsTable.map((post) => console.log(post.slug))
  return {
    paths: postsTable.map((post) => getBlogLink(post.slug)),
    fallback: true,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ post, redirect, preview }) => {
  const router = useRouter()

  let listTagName: string | null = null
  let listLastId: string | null = null
  let listMap: {
    [id: string]: {
      key: string
      isNested?: boolean
      nested: string[]
      children: React.ReactFragment
    }
  } = {}

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [redirect, post])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!post) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
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
          const id = block.id
          const type = block.type
          const properties = block[type]

          let toRender = []

          const renderHeading = (Type: string | React.ComponentType) => {
            toRender.push(
              <Heading key={id}>
                <Type key={id}>{textBlock(properties.text, true, id)}</Type>
              </Heading>
            )
          }

          const renderBookmark = ({ link, title, description, format }) => {
            const { bookmark_icon: icon, bookmark_cover: cover } = format
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
            )
          }

          switch (type) {
            case 'page':
            case 'divider':
              break
            case 'text': {
              if (properties) {
                toRender.push(textBlock(properties.text, false, id))
              }
              break
            }
            case 'paragraph': {
              if (properties) {
                toRender.push(
                  <p>
                    {properties.text.length
                      ? properties.text[0].plain_text
                      : ''}
                  </p>
                )
              }
              break
            }
            case 'image':
            case 'video': {
              const isImage = type === 'image'
              const Comp = isImage ? 'img' : 'video'
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
              )
              break
            }
            case 'embed':
              break
            case 'heading_1':
              renderHeading('h1')
              break
            case 'heading_2':
              renderHeading('h2')
              break
            case 'heading_3':
              renderHeading('h3')
              break
            case 'bookmark':
              // const { link, title, description } = properties
              // const { format = {} } = value
              // renderBookmark({ properties.url })
              toRender.push(
                <p key={id}>
                  {' '}
                  <a href={properties.url}>{properties.url}</a>{' '}
                  {properties.caption
                    .map((caption) => caption.plain_text)
                    .join('\n')}
                </p>
              )
              break
            case 'code': {
              if (properties.text) {
                // const content = properties.text.map(content => content.text.content)
                const content = properties.text[0].text.content
                const language = properties.language

                if (language === 'LiveScript') {
                  // this requires the DOM for now
                  toRender.push(
                    <ReactJSXParser
                      key={id}
                      jsx={content}
                      components={components}
                      componentsOnly={false}
                      renderInpost={false}
                      allowUnknownElements={true}
                      blacklistedTags={['script', 'style']}
                    />
                  )
                } else {
                  toRender.push(
                    <components.Code key={id} language={language || ''}>
                      {content}
                    </components.Code>
                  )
                }
              }
              break
            }
            case 'quote': {
              // if (properties.title) {
              //   toRender.push(
              //     React.createElement(
              //       components.blockquote,
              //       { key: id },
              //       properties.title
              //     )
              //   )
              // }
              break
            }
            case 'callout': {
              // toRender.push(
              //   <div className="callout" key={id}>
              //     {value.format?.page_icon && (
              //       <div>{value.format?.page_icon}</div>
              //     )}
              //     <div className="text">
              //       {textBlock(properties.title, true, id)}
              //     </div>
              //   </div>
              // )
              break
            }
            // case 'tweet': {
            //   if (properties.html) {
            //     toRender.push(
            //       <div
            //         dangerouslySetInnerHTML={{ __html: properties.html }}
            //         key={id}
            //       />
            //     )
            //   }
            //   break
            // }
            case 'equation': {
              // if (properties && properties.title) {
              //   const content = properties.title[0][0]
              //   toRender.push(
              //     <components.Equation key={id} displayMode={true}>
              //       {content}
              //     </components.Equation>
              //   )
              // }
              break
            }
            case 'toggle': {
              // if (properties && properties.title) {
              //   toRender.push(
              //     <div className="text">
              //       {textBlock(properties.title, false, id)}
              //     </div>
              //   )
              // }
              break
            }
            case 'collection_view': {
              // console.log('collection_view')
              // console.log(properties)
              // console.log(value)
              // toRender.push(
              //   <components.CollectionView key={id} collection_id={value.collection_id} view_ids={value.view_ids}>
              //   </components.CollectionView>
              // )
              break
            }
            default:
              if (
                process.env.NODE_ENV !== 'production' &&
                !listTypes.has(type)
              ) {
                console.log('unknown type', type)
              }
              break
          }
          return toRender
        })}
      </div>
    </>
  )
}

export default RenderPost
