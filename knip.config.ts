import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["src/routes/**/*.{ts,tsx}", "scripts/**/*.ts", "src/router.tsx"],
	project: ["src/**/*.{ts,tsx}", "scripts/**/*.ts"],
	ignore: [
		"build/**",
		"dist/**",
		"node_modules/**",
		".output/**",
		"src/routeTree.gen.ts",
	],
	ignoreDependencies: [
		"tailwindcss", // Used via @tailwindcss/vite plugin
	],
	ignoreExportsUsedInFile: true,
};

export default config;
