export type MaybeVersion = string | null;
export type Version = string;

export interface VersionStorage {
  get: () => MaybeVersion;
  set: (value: Version) => void;
}

export type VersionGetter = () => Version;

export type ChangeLog = {
  title: string;
  description: string;
  versions: Array<{
    version: string | null;
    title: string;
    date: string | null;
    body: string;
    parsed: Record<string, string[]>;
  }>;
};
