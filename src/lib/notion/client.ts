import { BLOG_INDEX_ID, NOTION_TOKEN } from './server-constants'

import { Client } from '@notionhq/client'
// import { getPage } from '@notionhq/client/build/src/api-endpoints';

const nonPreviewTypes = new Set(['editor', 'page', 'collection_view'])

export const client = new Client({ auth: NOTION_TOKEN })
// const blog_db = client.databases.query({
//     database_id: BLOG_INDEX_ID,
//   });

export async function getNotionUsers(ids: string[]) {
  const results = (
    await client.users.list({ start_cursor: '', page_size: 100 })
  ).results

  const users: any = {}

  for (const user of results) {
    users[user.id] = { full_name: user.name }
  }

  return { users }
}

export async function getPosts() {
  const response = await client.databases.query({
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    database_id: BLOG_INDEX_ID,
  })

  return response
}

export async function getPostPreview(pageId: string) {
  if (typeof pageId != 'string') {
    for (const [key, value] of Object.entries(pageId)) {
      console.log(`${key}: ${value}`)
    }
  }
  let blocks = (await client.blocks.children.list({ block_id: pageId })).results
  let dividerIndex = 0

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'divider') {
      dividerIndex = i
      break
    }
  }

  // blocks = blocks
  //   .splice(0, dividerIndex)
  //   .filter(({ value: { type } }: any) => !nonPreviewTypes.has(type))

  const content = blocks.splice(0, dividerIndex)
  // content.map(block => block[block.type].text[0]["plain_text"]).join('\n')
  const content_str = content
    .map((block, idx) =>
      block[block.type].text.map((text) => text.plain_text).join('\n')
    )
    .join('\n')

  // return `${content[0][content["type"]]}`;
  return content_str
}

export async function getPostsInfos(preview: boolean = true): Promise<any[]> {
  const results = (await getPosts()).results
  const posts: any = []

  let preview_content = ''

  for (const post of results) {
    if (preview) {
      preview_content = await getPostPreview(post.id)
    }

    posts.push({
      id: post.id,
      slug:
        post.properties['Slug']['multi_select'].map((s) => s.name).join('-') +
        '-' +
        post.id.split('-').join(''),
      date: post.properties['Date']['date']['start'],
      author: post.properties['Authors']['people']
        .map((s) => s.name)
        .join(', '),
      title: post.properties['Page']['title'][0]['plain_text'],
      preview: preview_content,
    })

    // postData.push(await getPageData(post.id))
  }

  return posts
}

// export async function getPostsInfos(): Promise<string[]> {
//   const results = (await getPosts()).results

//   const posts: any = []
//   results.forEach(async (page) => {
//     const post = await getPageInfo(page.id)
//     posts.push(post)
//   })

//   return posts
// }

export async function getPageInfo(pageId: string) {
  if (typeof pageId != 'string') {
    for (const [key, value] of Object.entries(pageId)) {
      console.log(`${key}: ${value}`)
    }
  }
  const post = await client.pages.retrieve({ page_id: pageId })

  return {
    slug:
      post.properties['Slug']['multi_select'].map((s) => s.name).join('-') +
      '-' +
      post.id.split('-').join(''),
    date: post.properties['Date']['date']['start'],
    author: post.properties['Authors']['people'].map((s) => s.name).join(', '),
    title: post.properties['Page']['title'][0]['plain_text'],
  }
}

export async function getPageData(pageId: string) {
  const page_info = await getPageInfo(pageId)
  const page_blocks = (await client.blocks.children.list({ block_id: pageId }))
    .results

  // const icon = page_response.icon?.emoji?

  return {
    ...page_info,
    page_blocks,
  }
}
