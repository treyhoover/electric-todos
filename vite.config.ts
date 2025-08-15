import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }) as PluginOption,
    tailwindcss() as PluginOption,
    tanstackStart({
      customViteReactPlugin: true,
      spa: {
        enabled: true,
      },
      target: "netlify",
    }),
    react(),
  ],
});
