import { withAuth } from "next-auth/middleware";

export const proxy = withAuth(
  function proxy() {
    // Custom proxy logic if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/forms/:path*",
    "/responses/:path*",
    "/analytics/:path*",
    "/api/forms/:path*",
    "/api/user/:path*",
    "/api/notifications/:path*"
  ],
};
