import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
	// output: "export",
	// webpack: (config, { isServer }) => {
	// 	config.resolve.alias = {
	// 		...config.resolve.alias,
	// 		"@/components": path.join(__dirname, "src/app/components"),
	// 		"@/hooks": path.join(__dirname, "src/app/hooks"),
	// 		"@/models": path.join(__dirname, "src/app/models"),
	// 		"@/services": path.join(__dirname, "src/app/services"),
	// 		"@/type": path.join(__dirname, "src/app/type"),
	// 	};
	// 	return config;
	// },
};

export default nextConfig;
