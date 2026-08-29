import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KyteLine — Outsourced Call Center & CX Teams for B2B" },
      {
        name: "description",
        content:
          "Outsourced call center and customer experience pods for B2B teams: inbound support, outbound calling, live chat, email support, lead gen and technical support.",
      },
      { name: "keywords", content: "outsourced call center, inbound call support, outbound calling, live chat support, email support outsourcing, lead generation, appointment setting, technical support outsourcing, B2B customer experience, CX outsourcing" },
      { name: "author", content: "KyteLine" },
      { name: "publisher", content: "https://www.kyteline.com" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "theme-color", content: "#0B132B" },
      
      // Open Graph (WhatsApp, Facebook, LinkedIn)
      { property: "og:site_name", content: "KyteLine" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.kyteline.com/" },
      { property: "og:title", content: "KyteLine — Outsourced Call Center & CX Teams" },
      {
        property: "og:description",
        content:
          "Launch dedicated outsourced call center and customer experience pods for your B2B business: inbound, outbound, live chat, email, and technical support.",
      },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: "https://www.kyteline.com/KyteLine.png" },
      { property: "og:image:secure_url", content: "https://www.kyteline.com/KyteLine.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "500" },
      { property: "og:image:height", content: "500" },
      { property: "og:image:alt", content: "KyteLine — Outsourced Call Center & CX Teams" },

      // Twitter Cards
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@KyteLine" },
      { name: "twitter:creator", content: "@KyteLine" },
      { name: "twitter:title", content: "KyteLine — Outsourced Call Center & CX Teams" },
      {
        name: "twitter:description",
        content:
          "Launch dedicated outsourced call center and customer experience pods for your B2B business in weeks.",
      },
      { name: "twitter:image", content: "https://www.kyteline.com/KyteLine.png" },
      { name: "twitter:image:alt", content: "KyteLine Logo" },
    ],
    links: [
      { rel: "canonical", href: "https://www.kyteline.com/" },
      { rel: "image_src", href: "https://www.kyteline.com/KyteLine.png" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preload", href: "/fonts/manrope-latin-400.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/sora-latin-600.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "icon", href: "/KyteLine.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/KyteLine.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KyteLine",
          url: "https://www.kyteline.com/",
          logo: "https://www.kyteline.com/KyteLine.png",
          description:
            "KyteLine builds outsourced call center and customer experience teams for growing B2B operations.",
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "sales",
              availableLanguage: ["English", "Spanish", "Urdu", "Arabic"],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
