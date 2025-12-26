import { NextRequest, NextResponse } from 'next/server';
import { getNotionAssetUrl } from '../../../lib/notion/client';
import { setHeaders, handleError } from '../../../lib/notion/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'asset url or blockId missing',
        },
        { status: 400 }
      );
    } else {
      // we need to re-encode it since it's decoded when added to searchParams
      const url = await getNotionAssetUrl(id);

      return NextResponse.redirect(url, 307);
    }
  } catch (error) {
    // handleError is not available in App Router, so we'll redirect to default image
    return NextResponse.redirect(
      'http://localhost:3000/goooice-and-notion.png',
      307
    );
  }
}
