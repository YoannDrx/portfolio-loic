import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr"],

  // Used when no locale matches
  defaultLocale: "fr",

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the external path, the
  // correct internal path can be inferred.
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/services": "/services",
    "/services/[id]": "/services/[id]",
    "/albums": "/albums",
    "/albums/[id]": "/albums/[id]",
    "/videos": "/videos",
    "/contact": "/contact",
    "/admin": "/admin",
    "/login": "/login",
    "/privacy-policy": "/privacy-policy",
    "/terms-of-use": "/terms-of-use",
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
