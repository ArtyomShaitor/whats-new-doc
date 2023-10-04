/// <reference path="../node_modules/bun-types/types.d.ts" />

export const copyToPackage = async (filePath: string, copyTo: string = "") => {
  const file = Bun.file(`../../${filePath}`);
  await Bun.write(`${process.cwd()}/${copyTo}${filePath}`, file);
};
