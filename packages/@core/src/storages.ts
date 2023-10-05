import type { MaybeVersion, Version, VersionStorage } from "./types";

export const createLocalStorage = (key: string): VersionStorage => ({
  get: () => globalThis.localStorage?.getItem(key),
  set: (value: Version) => globalThis.localStorage?.setItem(key, value),
});

export const createMockStorage = (): VersionStorage => {
  let appVersion: MaybeVersion = "";

  return {
    get: () => appVersion,
    set: value => {
      appVersion = value;
    },
  };
};

export const storages = {
  createLocalStorage,
  createMockStorage,
} as const;
