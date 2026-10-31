import type { BackgroundTaskOptions } from "../../src/external/background-task";
export type { BackgroundTaskOptions };

export async function runBackgroundTask<T>(
  options: BackgroundTaskOptions,
  task: () => Promise<T>,
): Promise<T | undefined> {
  try {
    return await task();
  } catch (error) {
    console.info(`[playground] ${options.tag}: ${(error as Error).message}`);
    return undefined;
  }
}
