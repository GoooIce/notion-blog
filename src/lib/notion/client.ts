import { BLOG_INDEX_ID, NOTION_TOKEN } from './server-constants';

import { Client } from '@notionhq/client';

const nonPreviewTypes = new Set(['editor', 'page', 'collection_view']);

export const client = new Client({
  auth: NOTION_TOKEN,
  notionVersion: '2025-09-03',
});

export async function getNotionAssetUrl(id: string): Promise<string> {
  const result = await client.blocks.retrieve({
    block_id: id,
  });

  // Type assertion for compatibility with new SDK
  const block = result as any;
  return block[block.type]?.file?.url || '';
}

export async function getPosts() {
  try {
    // Use search API to find all published pages
    const searchResult = await client.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      page_size: 100, // Adjust based on needs
    });

    // Filter for pages that have the Published property set to true
    const publishedPages = searchResult.results.filter((page: any) => {
      return (
        page.properties &&
        page.properties.Published &&
        page.properties.Published.checkbox === true
      );
    });

    // Convert to the expected format
    return {
      object: 'list',
      results: publishedPages,
      next_cursor: null,
      has_more: false,
    };
  } catch (error) {
    console.error('Failed to fetch posts using search API:', error);
    throw error;
  }
}

export async function getPostPreview(pageId: string) {
  if (typeof pageId != 'string') {
    for (const [key, value] of Object.entries(pageId)) {
      console.log(`${key}: ${value}`);
    }
  }
  let blocks = (await client.blocks.children.list({ block_id: pageId }))
    .results;
  let dividerIndex = blocks.length; // Default to end of blocks if no divider

  // Find divider position
  for (let i = 0; i < blocks.length; i++) {
    if ((blocks[i] as any).type === 'divider') {
      dividerIndex = i;
      break;
    }
  }

  // Get content before divider (or first 5 blocks if no divider)
  const maxPreviewBlocks = dividerIndex === blocks.length ? Math.min(5, blocks.length) : dividerIndex;
  const content = blocks.slice(0, maxPreviewBlocks);

  const content_str = content
    .map((block) => {
      const blockData = block as any;
      const blockType = blockData.type;
      const blockContent = blockData[blockType];

      // Handle different text structures in the new SDK
      if (blockContent?.text) {
        return blockContent.text.map((text: any) => text.plain_text || '').join('');
      } else if (blockContent?.rich_text) {
        return blockContent.rich_text.map((text: any) => text.plain_text || '').join('');
      } else {
        return '';
      }
    })
    .join('\n');

  return content_str;
}

export async function getPostsInfos(preview: boolean = true): Promise<any[]> {
  const results = (await getPosts()).results;
  const posts: any = [];

  let preview_content = '';

  for (const post of results) {
    if (preview) {
      preview_content = await getPostPreview(post.id);
    }

    // Handle different property structures that might exist
    const properties = (post as any).properties || {};

    posts.push({
      id: post.id,
      slug: getSlugFromPost(post, properties),
      date: getDateFromPost(properties),
      author: getAuthorFromPost(properties),
      title: getTitleFromPost(properties),
      preview: preview_content,
    });
  }

  return posts;
}

export async function getPageInfo(pageId: string) {
  if (typeof pageId != 'string') {
    for (const [key, value] of Object.entries(pageId)) {
      console.log(`${key}: ${value}`);
    }
  }
  const post = await client.pages.retrieve({ page_id: pageId });
  const properties = (post as any).properties || {};

  return {
    slug: getSlugFromPost(post, properties),
    date: getDateFromPost(properties),
    author: getAuthorFromPost(properties),
    title: getTitleFromPost(properties),
  };
}

export async function getPageData(pageId: string) {
  const page_info = await getPageInfo(pageId);
  let page_blocks = (await client.blocks.children.list({ block_id: pageId }))
    .results;

  return {
    ...page_info,
    page_blocks,
  };
}

// Helper functions to extract data from different property structures
function getSlugFromPost(post: any, properties: any): string {
  if (properties.Slug?.multi_select) {
    return (
      properties.Slug.multi_select.map((s: any) => s.name).join('-') +
      '-' +
      post.id.split('-').join('')
    );
  }
  // Fallback: create slug from title if no Slug property
  const title = getTitleFromPost(properties);
  return (
    title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '') +
    '-' +
    post.id.split('-').join('')
  );
}

function getDateFromPost(properties: any): string {
  if (properties.Date?.date?.start) {
    return properties.Date.date.start;
  }
  // Fallback: use created time
  return new Date().toISOString();
}

function getAuthorFromPost(properties: any): string {
  if (properties.Authors?.people) {
    return properties.Authors.people
      .map((s: any) => s.name || 'Unknown')
      .join(', ');
  }
  return 'Unknown';
}

function getTitleFromPost(properties: any): string {
  if (properties.Page?.title?.[0]?.plain_text) {
    return properties.Page.title[0].plain_text;
  }
  if (properties.title?.[0]?.plain_text) {
    return properties.title[0].plain_text;
  }
  return 'Untitled';
}
