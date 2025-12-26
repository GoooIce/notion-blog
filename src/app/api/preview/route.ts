import { NextRequest, NextResponse } from 'next/server';
import { getPostsInfos } from '../../../lib/notion/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (typeof token !== 'string') {
    return NextResponse.json({ message: 'invalid token' }, { status: 401 });
  }
  if (token !== process.env.NOTION_TOKEN) {
    return NextResponse.json({ message: 'not authorized' }, { status: 404 });
  }

  const postsTable = await getPostsInfos();

  if (!postsTable) {
    return NextResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 401 }
    );
  }

  const response = NextResponse.redirect(new URL('/blog', req.url), 307);
  response.cookies.set({
    name: '__next_preview_data',
    value: JSON.stringify({}),
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return response;
}
