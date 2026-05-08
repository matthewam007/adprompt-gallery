/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "chatgpt.com" },
      { protocol: "https", hostname: "claude.ai" },
      { protocol: "https", hostname: "gemini.google.com" },
      { protocol: "https", hostname: "www.midjourney.com" },
      { protocol: "https", hostname: "www.perplexity.ai" },
      { protocol: "https", hostname: "www.meta.ai" },
    ],
  },
};

export default nextConfig;
