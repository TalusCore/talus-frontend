import type { ResponseStat, Stat, StatName } from './types';

const ROLLING_AVERAGE_WINDOW = 5;

export const newStatData = (name: StatName, stats?: ResponseStat[]): Stat[] => {
  const newStats = stats ?? [];

  return newStats
    .filter(stat => stat.statName === name)
    .map(stat => ({
      value: stat.value,
      timestamp: new Date(stat.timestamp)
    }));
};

export const mostRecentValues = (stats: Stat[]): Stat[] => {
  const sortedStats = [...stats].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return sortedStats.slice(0, ROLLING_AVERAGE_WINDOW);
};

export const sumValues = (values: number[]): number => {
  return values.reduce((acc, val) => acc + val, 0);
};

export const averageStat = (stats: Stat[]): number => {
  if (stats.length === 0) {
    return 0;
  }

  return sumValues(stats.map(stat => stat.value)) / stats.length;
};

export const startOfToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getAge = (birthday: Date): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
};
