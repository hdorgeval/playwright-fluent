export const sleep = (durationInMilliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, durationInMilliseconds));
