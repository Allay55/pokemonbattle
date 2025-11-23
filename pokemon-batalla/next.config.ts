/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // 👈 ESTO genera la carpeta /out automáticamente
  images: {
    unoptimized: true,        // 👈 NECESARIO para que Netlify acepte <Image />
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wallpaper.forfun.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      }
    ],
  },
};

module.exports = nextConfig;
