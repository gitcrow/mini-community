/**
 * 이 어플리케이션에서 미들웨어의 역할: 사용자 로그인 여부에 따라 접근할 수 있는 페이지를 제한시킴
 */
import { NextRequest, NextResponse } from "next/server";

export const config = {
	matcher: ['/sign-in', '/sign-up', '/post-write'],
};

function middleware(req: NextRequest) {
	const sessionToken = req.cookies.getAll().find((cookie) => {
		return cookie.name.endsWith('next-auth.session-token');
	});
	const isAuthenticated = !!sessionToken;

	switch (req.nextUrl.pathname) {
		case '/sign-in':
		case '/sign-up':
			if (isAuthenticated) {
				return NextResponse.redirect(new URL('/', req.url));
			}
			break;
		case '/post-write':
			if (!isAuthenticated) {
				return NextResponse.redirect(new URL('/sign-in', req.url));
			}
	}

	return NextResponse.next();
}

export default middleware;
