import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "alfamart.co.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "asset-2.tstatic.net",
        pathname: "/**",
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
