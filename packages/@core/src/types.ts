export type MaybeVersion = string | null;
export type Version = string;

export interface VersionStorage {
  get: () => MaybeVersion;
  set: (value: Version) => void;
}

export type VersionGetter = () => Version;

export type Temp = string;
