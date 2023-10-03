import { UpdatesChecker } from "wnd-updates-checker";
import { useCallback, useEffect, useState } from "react";

export const useUpdatesChecker = (updateChecker: UpdatesChecker) => {
  const [hasUpdates, setHasUpdates] = useState(updateChecker.hasUpdates());

  const applyLatestVersion = useCallback(() => {
    updateChecker.applyLatestVersion();
  }, [updateChecker]);

  useEffect(() => {
    const listener = updateChecker.listen(() => {
      setHasUpdates(updateChecker.hasUpdates());
    });

    return listener;
  }, [updateChecker]);

  return [hasUpdates, applyLatestVersion] as const;
};
