import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // Use the request headers to get cookies
  const cookies = parseCookies({ req: { headers: { cookie: request.headers.get('cookie') || '' } } });
  const token = cookies.token;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}