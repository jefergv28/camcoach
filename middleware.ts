// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('userCamCoach')?.value;

//   // Público: landing, login, register
//   if (request.nextUrl.pathname.startsWith('/login') ||
//       request.nextUrl.pathname.startsWith('/register') ||
//       request.nextUrl.pathname === '/') {
//     return NextResponse.next();
//   }

//   // Dashboard requiere login
//   if (!token && request.nextUrl.pathname.startsWith('/')) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };
