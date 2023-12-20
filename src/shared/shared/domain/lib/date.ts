const SECOND_IN_MS = 1000;
const DAY_IN_MS = SECOND_IN_MS * 60 * 60 * 24;

function getDateMillisecondsAgo(milliseconds: number): Date {
  const now = new Date();

  return new Date(now.getTime() - milliseconds);
}

function getDateWithinMilliseconds(milliseconds: number): Date {
  const now = new Date();

  return new Date(now.getTime() + milliseconds);
}

export function getDateSecondsAgo(seconds: number): Date {
  return getDateMillisecondsAgo(seconds * SECOND_IN_MS);
}
export function getDateDaysAgo(days: number): Date {
  return getDateMillisecondsAgo(days * DAY_IN_MS);
}

export function getDateWithinSeconds(seconds: number): Date {
  return getDateWithinMilliseconds(seconds * SECOND_IN_MS);
}

export function getDateWithinDays(days: number): Date {
  return getDateWithinMilliseconds(days * DAY_IN_MS);
}

export function getDateDiffInDays(date1: Date, date2: Date): number {
  const diff = date1.getTime() - date2.getTime();
  const diffInDays = diff / DAY_IN_MS;

  return Math.round(diffInDays);
}

export function getNow(): Date {
  return new Date(Date.now());
}
