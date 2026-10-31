// Boundary: shared-l-p-m-w-0 `Or`. Runs a background load with error reporting; resolves undefined on soft failure.
export interface BackgroundTaskOptions {
  origin: "background";
  tag: string;
}

export function runBackgroundTask<T>(
  _options: BackgroundTaskOptions,
  _task: () => Promise<T>,
): Promise<T | undefined> {
  throw new Error("external: shared-l-p-m-w-0 Or");
}
