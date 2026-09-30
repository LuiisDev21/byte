import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar modo standalone si se especifica (ej. Docker / CI)
  ...(process.env.BUILD_STANDALONE === 'true' ? { output: 'standalone' as const } : {}),
  
  // Configuración de imágenes (si usas next/image)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    qualities: [80, 85, 90],
  },
};

export default nextConfig;
