import { useUpdatesChecker as useUpdatesCheckerReact } from "@whats-new-doc/react";
import { UpdatesChecker } from "@whats-new-doc/core";
import { useEffect, useState } from "react";

export type UpdateCheckerOptions = {
  initialValue?: boolean;
};

export const useUpdatesChecker = (
  updateChecker: UpdatesChecker,
  { initialValue = false }: UpdateCheckerOptions = {},
): ReturnType<typeof useUpdatesCheckerReact> => {
  const [initial, setInitial] = useState<typeof initialValue | null>(
    initialValue,
  );

  const [hasUpdatesReact, applyLatestVersion] =
    useUpdatesCheckerReact(updateChecker);

  useEffect(() => {
    setInitial(null);
  }, []);

  const hasUpdates = initial ?? hasUpdatesReact;

  return [hasUpdates, applyLatestVersion];
};
