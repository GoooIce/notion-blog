const fs = require('fs');
const path = require('path');
const {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
} = require('./src/lib/notion/server-constants');

try {
  fs.unlinkSync(path.resolve('.blog_index_data'));
} catch (_) {
  /* non fatal */
}
try {
  fs.unlinkSync(path.resolve('.blog_index_data_previews'));
} catch (_) {
  /* non fatal */
}

const warnOrError =
  process.env.NODE_ENV !== 'production'
    ? console.warn
    : (msg) => {
        throw new Error(msg);
      };

if (!NOTION_TOKEN) {
  // We aren't able to build or serve images from Notion without the
  // NOTION_TOKEN being populated
  warnOrError(
    `\nNOTION_TOKEN is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  );
}

if (!BLOG_INDEX_ID) {
  // We aren't able to build or serve images from Notion without the
  // NOTION_TOKEN being populated
  warnOrError(
    `\nBLOG_INDEX_ID is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  );
}

module.exports = {
  // future: {
  //   webpack5: true,
  // },
  // images: {
  // loader: 'sharp',
  // domains: ['amazonaws.com'],
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
    webpack(cfg, { dev, isServer }) {
    // Add Node.js polyfills for client-side builds
    if (!isServer) {
      cfg.resolve.fallback = {
        ...cfg.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        fs: false,
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        os: require.resolve('os-browserify/browser'),
        util: require.resolve('util'),
      };
    }

    // Temporarily skip RSS build step due to Node.js polyfill issues
    // TODO: Fix RSS generation for Next.js 15.5.4
    return cfg;
  },
};
