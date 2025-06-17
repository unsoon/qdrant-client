import { defineConfig, Options } from "tsup";
import { peerDependencies } from "./package.json";

export default defineConfig((options: Options) => ({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  minify: true,
  clean: true,
  external: [...Object.keys(peerDependencies)],
  ...options,
}));
