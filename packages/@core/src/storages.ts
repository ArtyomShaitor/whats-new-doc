import type { MaybeVersion, Version, VersionStorage } from "./types";

export const createLocalStorage = (key: string): VersionStorage => ({
  // @ts-ignore
  get: () => globalThis.localStorage.getItem(key),
  // @ts-ignore
  set: (value: Version) => globalThis.localStorage.setItem(key, value),
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
