/// <reference path="../node_modules/bun-types/types.d.ts" />
import dts from "bun-plugin-dts";

const packageJson = require(`${process.cwd()}/package.json`);
const peerDeps = Object.keys(packageJson.peerDependencies ?? {});

await Bun.build({
  entrypoints: [`${process.cwd()}/src/index.ts`],
  outdir: `${process.cwd()}/dist`,
  format: "esm",
  external: peerDeps,
  plugins: [
    dts({
      output: {
        noBanner: true,
        exportReferencedTypes: false,
        inlineDeclareExternals: false,
      },
    }),
  ],
});
