import type { NextConfig } from "next";
const Critters = require('critters');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['avatars.githubusercontent.com','cdn.jsdelivr.net','optim.tildacdn.biz','kompunity.by','papik.pro','img.tehnomaks.ru','upload.wikimedia.org','www.tiandy.com','www.hiwatch.com','images.remotePatterns'],
    
    deviceSizes: [300, 320,350,430,500,640, 750, 828, 1080, 1200, 1280, 1550, 1920, 2048, 2500, 3000, 3840],
  },
  experimental:{
    optimizeCss: true,
    inlineCss: true,
  },
};
export default nextConfig;