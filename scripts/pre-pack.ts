import { readdir } from "node:fs/promises";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

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

// We will only try to update dependencies in these package file types
const DEP_TYPES_TO_UPDATE = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
];

// Used to look up the current package.json version at a location
const getPackageFile = (location: string) =>
  // @ts-ignore
  JSON.parse(readFileSync(`${location}/package.json`));

// Object map of entries to make version replacement easier when we publish
const workspaceVersionMap = await Object.fromEntries(
  (await getWorkspacesList()).map(({ location }) => {
    const packageFile = getPackageFile(location);
    return [
      packageFile.name,
      { location, version: packageFile.version, packageJson: packageFile },
    ];
  }),
);

// Go replace versions in each package.json file
for (const pkg in workspaceVersionMap) {
  const { location, packageJson: packageJsonOriginal } =
    workspaceVersionMap[pkg];

  // Get the packagefile data that we will use to rewrite the version updates.
  // NOTE: This data will be mutated in JS before we output to overwrite the file
  const packageFile = JSON.parse(JSON.stringify(packageJsonOriginal));

  // Used to target a package.json dependency list type and if the dependency matches one of our workspace packages,
  // we update the version to match the current workspace version in our workspace version map.
  const mutuateDeps = (depType: string) => {
    // Get the dependency type from the file and iterate over each dependency
    for (const dep in packageFile[depType]) {
      // if a dependency matches one of the dependencies in our workspace map
      if (Object.keys(workspaceVersionMap).includes(dep)) {
        // we mutate the package file data in memory to match the current workspace version
        packageFile[depType][dep] = workspaceVersionMap[dep].version;
      }
    }
  };

  // Go mutate the allowed dependency types
  DEP_TYPES_TO_UPDATE.map(dependencyType => mutuateDeps(dependencyType));

  if (existsSync(`${location}/.temp/package.json`)) {
    continue;
  }

  mkdirSync(`${location}/.temp`);

  writeFileSync(
    `${location}/.temp/package.json`,
    `${JSON.stringify(packageJsonOriginal, null, 2)}\n`,
  );

  // Write our updated files
  writeFileSync(
    `${location}/package.json`,
    `${JSON.stringify(packageFile, null, 2)}\n`,
  );
}
