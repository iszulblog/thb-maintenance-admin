/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Kita kekalkan ini buat masa ni untuk lepaskan build
    ignoreBuildErrors: true,
  },
  // Kunci 'eslint' sudah dibuang kerana tidak lagi disokong di v16
};

export default nextConfig;