import type { NextConfig } from "next";

/**
 * Vercel sets this in its build container.
 *
 * The standalone build cannot be left on there: Vercel runs its own tracing
 * step after `next build`, and standalone mode consumes the .nft.json trace
 * files that step expects, so the deploy fails with an ENOENT on
 * next-server.js.nft.json. Vercel ignores the Dockerfile, but it does not
 * ignore this setting.
 */
const onVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  /* Emits .next/standalone: a self-contained server with only the packages it
     actually imports. It is what the Dockerfile ships, and it is the
     difference between a 1.2GB image and a small one. */
  output: onVercel ? undefined : "standalone",
};

export default nextConfig;
