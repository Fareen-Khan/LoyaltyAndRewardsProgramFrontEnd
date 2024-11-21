/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export", // Enables static HTML export
	trailingSlash: true, // Ensures all routes have trailing slashes for compatibility
	images: {
		unoptimized: true, // Disables image optimization for static deployments
	},
};

export default nextConfig;
