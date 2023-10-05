import { readdir } from "node:fs/promises";
const { readFileSync, existsSync, writeFileSync, unlinkSync } = require("fs");

const getWorkspacesList = async () => {
  const list: Array<{ location: string; name: string }> = [];
  const { workspaces } = require(`../package.json`);

  for (const workspace of workspaces) {
    const packagePath = workspace.replace("/*", "");
    const packages = await readdir(`./${packagePath}`);
    packages.forEach(pkg => {
      list.push({
        name: pkg,
        location: `./${packagePath}/${pkg}`,
      });
    });
  }

  return list;
};

const getBackupPackageFile = (location: string) =>
  JSON.parse(readFileSync(`${location}/.temp/package.json`));

// Object map of entries to make version replacement easier when we publish
const workspaceVersionMap = await Object.fromEntries(
  (await getWorkspacesList()).map(({ location }) => {
    const packageFileOriginal = getBackupPackageFile(location);
    return [
      packageFileOriginal.name,
      {
        location,
        packageJsonOriginal: packageFileOriginal,
      },
    ];
  }),
);

// Go replace versions in each package.json file
for (const pkg in workspaceVersionMap) {
  const { location, packageJsonOriginal } = workspaceVersionMap[pkg];

  if (!existsSync(`${location}/.temp/package.json`)) {
    continue;
  }

  writeFileSync(
    `${location}/package.json`,
    `${JSON.stringify(packageJsonOriginal, null, 2)}\n`,
  );

  unlinkSync(`${location}/.temp/package.json`);
}
