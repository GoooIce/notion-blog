// use commonjs so it can be required without transpiling
const path = require('path');

const normalizeId = (id) => {
  if (!id) return id;
  if (id.length === 36) return id;
  // Handle new Notion API v5 format with secret_ prefix
  if (id.startsWith('secret_')) {
    // The new secret format might already be the correct format for v5.1.0
    // Let's return it as-is for now and let the API handle validation
    return id;
  }
  if (id.length !== 32) {
    throw new Error(
      `Invalid blog-index-id: ${id} should be 32 characters long or start with 'secret_'. Info here https://github.com/ijjk/notion-blog#getting-blog-index-and-token`
    );
  }
  return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(
    16,
    4
  )}-${id.substr(20)}`;
};

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const BLOG_INDEX_ID = normalizeId(process.env.BLOG_INDEX_ID);
const API_ENDPOINT = 'https://www.notion.so/api/v3';
const BLOG_INDEX_CACHE = path.resolve('.blog_index_data');

module.exports = {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
  API_ENDPOINT,
  BLOG_INDEX_CACHE,
  normalizeId,
};
