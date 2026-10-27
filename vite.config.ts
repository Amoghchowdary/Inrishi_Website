import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [viteReact(), tailwindcss()],
  build: {
    target: "es2022",
    sourcemap: false,
    minify: "oxc",
    cssCodeSplit: true,
  },
});
