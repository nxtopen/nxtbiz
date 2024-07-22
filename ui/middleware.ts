import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { token } = parseCookies({ req: request });
    console.log(token)
    if (!token) {
        // Redirect to login if token cookie is not present
        return NextResponse.rewrite('/login');
    }

    // If token is present, continue to next middleware or handler
    return NextResponse.next();
}