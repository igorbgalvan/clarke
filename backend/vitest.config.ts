import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
    /* Falha se um teste não tiver asserções (evita testes vazios a passar). */
    passWithNoTests: false,
  },
});
