import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  if (url.pathname === '/') {
    url.pathname = '/dashboard/home'
    return NextResponse.redirect(url)
  }

  if (url.href === 'https://www.zuzalu.city/tools/communitygraphs') {
    return NextResponse.redirect('http://communitygraphs.xyz/login/zuzalu')
  }
}
