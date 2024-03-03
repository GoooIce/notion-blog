import Link from 'next/link'
import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import {
  getBlogLink,
  getDateStr,
  postIsPublished,
} from '../../lib/blog-helpers'
// import { textBlock } from '../../lib/notion/renderers'
import { getPostsInfos } from '../../lib/notion/client'

export async function getStaticProps({ preview }) {
  // const postsTable = await getBlogIndex()

  // const authorsToGet: Set<string> = new Set()
  const posts: any[] = await getPostsInfos(preview)
  // const { users } = await getNotionUsers([...authorsToGet])

  // posts.map((post) => {
  //   post.Authors = post.Authors.map((id) => users[id].full_name)
  // })

  return {
    props: {
      preview: false,
      posts,
    },
    revalidate: 10,
  }
}

const Index = ({ posts = [], preview }) => {
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
                  <Link href="/blog/[slug]" as={getBlogLink(post.slug)}>
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
          )
        })}
      </div>
    </>
  )
}

export default Index
