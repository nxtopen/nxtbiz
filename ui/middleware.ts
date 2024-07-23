import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Exclude the /login path from the middleware
    if (request.nextUrl.pathname === '/login') {
        return NextResponse.next();
    }

    const { token } = parseCookies({ req: request });
    if (!token) {
        // Redirect to login if token cookie is not present
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // If token is present, continue to next middleware or handler
    return NextResponse.next();
}