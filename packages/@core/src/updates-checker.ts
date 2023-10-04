import type { Version, VersionGetter, VersionStorage } from "./types";

type Listener = (value: string) => void;

export class UpdatesChecker {
  private storage: VersionStorage;
  private latestAppVersionGetter: VersionGetter;
  private listeners: Listener[] = [];

  /**
   *
   * @param storage Current user version storage
   * @param latestAppVersionGetter Get the latest version of the app
   */
  constructor(storage: VersionStorage, latestAppVersionGetter: VersionGetter) {
    this.storage = storage;
    this.latestAppVersionGetter = latestAppVersionGetter;

    if (!storage.get()) {
      this.applyLatestVersion();
    }
  }

  hasUpdates() {
    const latestAppVersion = this.latestAppVersionGetter();
    const currentAppVersion = this.storage.get() ?? latestAppVersion;

    return latestAppVersion !== currentAppVersion;
  }

  setVersion(newVersion: Version) {
    this.storage.set(newVersion);
    this.emit(newVersion);
  }

  applyLatestVersion() {
    const newVersion = this.latestAppVersionGetter();
    this.setVersion(newVersion);
  }

  listen(listener: Listener) {
    this.listeners.push(listener);

    return () => this.unlisten(listener);
  }

  unlisten(listener: Listener) {
    this.listeners = this.listeners.filter(lstnr => lstnr !== listener);
  }

  emit(value: string) {
    this.listeners.forEach(listener => listener(value));
  }
}
