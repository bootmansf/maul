import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";

// Shared PortableText config — renders "link" marks as internal <Link>
// when the href starts with "/" and external <a target="_blank"> otherwise.
export const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const isExternal = /^https?:\/\//i.test(href);
      return isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href}>{children}</Link>
      );
    },
    sup: ({ children }) => <sup>{children}</sup>,
  },
};
