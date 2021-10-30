import { resolve } from 'path'
import { writeFile } from './fs-helpers'
import { renderToStaticMarkup } from 'react-dom/server'

import { textBlock } from './notion/renderers'

import { getPostsInfos } from './notion/client'
import { getBlogLink } from './blog-helpers'

import { loadEnvConfig } from '@next/env'
import serverConstants from './notion/server-constants'

// must use weird syntax to bypass auto replacing of NODE_ENV
process.env['NODE' + '_ENV'] = 'production'
process.env.USE_CACHE = 'true'

// constants
const NOW = new Date().toJSON()

function mapToAuthor(author) {
  return `<author><name>${author.name}</name></author>`
}

function decode(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function mapToEntry(post) {
  post.link = getBlogLink(post.slug)

  return `
    <entry>
      <id>${post.link}</id>
      <title>${decode(post.title)}</title>
      <link href="${post.link}"/>
      <updated>${new Date(post.date).toJSON()}</updated>
      <content type="xhtml">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${renderToStaticMarkup(post.preview)}
          <p class="more">
            <a href="${post.link}">Read more</a>
          </p>
        </div>
      </content>
      ${(post.authors || []).map(mapToAuthor).join('\n      ')}
    </entry>`
}

function concat(total, item) {
  return total + item
}

function createRSS(blogPosts = []) {
  const postsString = blogPosts.map(mapToEntry).reduce(concat, '')

  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>GoooIce's Notion Blog</title>
    <subtitle>Blog</subtitle>
    <link href="/atom" rel="self" type="application/rss+xml"/>
    <link href="/" />
    <updated>${NOW}</updated>
    <id>GoooIce's Notion Blog</id>${postsString}
  </feed>`
}

async function main() {
  await loadEnvConfig(process.cwd())
  serverConstants.NOTION_TOKEN = process.env.NOTION_TOKEN
  serverConstants.BLOG_INDEX_ID = serverConstants.normalizeId(
    process.env.BLOG_INDEX_ID
  )

  const blogPosts = await getPostsInfos()

  const outputPath = './public/atom'
  await writeFile(resolve(outputPath), createRSS(blogPosts))
  console.log(`Atom feed file generated at \`${outputPath}\``)
}

main().catch((error) => console.error(error))
