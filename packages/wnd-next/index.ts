import { useUpdatesChecker as useUpdatesCheckerReact } from "wnd-react";
import { UpdatesChecker } from "wnd-updates-checker";
import { useEffect, useState } from "react";

type UpdateCheckerOptions = {
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
