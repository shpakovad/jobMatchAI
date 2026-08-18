import createMiddleware from "next-intl/middleware";

import { routing } from "./navigation";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(ru|en)/:path*", "/((?!api|_next/static|_next/image||icon.svg).*)"],
};
