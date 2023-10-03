import type { Async, MaybeVersion, Version } from "wnd-types";

export interface VersionStorage {
  get: () => MaybeVersion;
  set: (value: Version) => void;
}

export const createLocalStorage = (key: string): VersionStorage => ({
  get: () => global.localStorage?.getItem(key),
  set: (value: Version) => global.localStorage?.setItem(key, value),
});

export const createMockStorage = (): VersionStorage => {
  let appVersion: MaybeVersion = null;

  return {
    get: () => appVersion,
    set: value => {
      appVersion = value;
    },
  };
};
