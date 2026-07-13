import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import path from "path";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src");

export default defineConfig({
  resolve: {
    // Match the tsconfig "@/*" -> "./src/*" alias so tests import the same way.
    alias: { "@": src },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
