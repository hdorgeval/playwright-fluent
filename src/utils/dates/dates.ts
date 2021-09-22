export type UpdatePolicy = 'always' | 'never' | '1/d' | '1/w' | '1/m';

export function toDays(policy: UpdatePolicy): number {
  switch (policy) {
    case '1/d':
      return 1;
    case '1/w':
      return 7;
    case '1/m':
      return 30;
    default:
      throw new Error(
        `Unknown update policy '${policy}'. Valid policies are: '1/d', '1/w', '1/m', 'always', 'never'`,
      );
  }
}

export function shouldUpdate(lastUpdate: Date, policy: UpdatePolicy): boolean {
  if (policy === 'never') {
    return false;
  }

  if (policy === 'always') {
    return true;
  }

  const now = new Date();
  const elapsedTimeInDays = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  const days = toDays(policy);
  return elapsedTimeInDays >= days;
}
