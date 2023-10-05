/// <reference path="../node_modules/bun-types/types.d.ts" />
import dts from "bun-plugin-dts";
import { copyToPackage } from "./copy";

const PACKAGE_DIR = process.cwd();

const packageJson = require(`${PACKAGE_DIR}/package.json`);
const peerDeps = Object.keys(packageJson.peerDependencies ?? {});

const sharedFiles = [".npmignore"];

sharedFiles.forEach(async file => await copyToPackage(file));

await Bun.build({
  entrypoints: [`${PACKAGE_DIR}/src/index.ts`],
  outdir: `${PACKAGE_DIR}/dist`,
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
