export type MaybeVersion = string | null;
export type Version = string;

export type Async<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

export type Changelog = {
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
