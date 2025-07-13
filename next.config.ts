import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['avatars.githubusercontent.com','cdn.jsdelivr.net','optim.tildacdn.biz','kompunity.by','papik.pro','img.tehnomaks.ru','upload.wikimedia.org','www.tiandy.com','www.hiwatch.com','images.remotePatterns'],
    
    deviceSizes: [300, 320,350,430,500,640, 750, 828, 1080, 1200, 1280, 1550, 1920, 2048, 2500, 3000, 3840],
  },
  experimental: {
    //ppr: true,         // Гибридный рендеринг
    inlineCss: true,    // Инлайнинг CSS (Pages Router)
    //reactCompiler: true,
    optimizeCss: true,  // Оптимизация CSS
    reactCompiler: true,
  },
  //compiler: {
    //styledComponents: true, // Для CSS-in-JS
  //},
  // Требуется для ppr
  //output: 'standalone', 
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { 
          key: 'Cache-Control', 
          value: 'public, max-age=31536000, immutable' 
        }
      ]
    }]
  }
};
export default nextConfig;