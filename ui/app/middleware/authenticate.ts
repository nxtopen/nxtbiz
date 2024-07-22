import { NextRequest, NextResponse } from 'next/server';
import { parseCookies } from 'nookies';
import jwt, { Secret } from 'jsonwebtoken';

const authenticate = (allowedRoles: string[] = []) => async (req: NextRequest, res: NextResponse) => {
    try {
        const cookies = parseCookies({ req });
        const token = cookies.token;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }

        const secret: Secret = process.env.JWT_SECRET as Secret;

        const decoded: any = jwt.verify(token, secret);

        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const { role } = decoded;

        if (!allowedRoles.includes(role)) {
            return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
        }
        return;
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
};

export default authenticate;
