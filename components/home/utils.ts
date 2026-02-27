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

export const totalHealthScore = (
  temperature: number,
  pressure: number,
  humidity: number,
  altitude: number,
  bpm: number,
  steps: number
): number => {
  const idealTemperature = 37;
  const idealPressure = 1013;
  const idealHumidity = 45;
  const idealAltitude = 300;
  const idealBPM = 70;
  const targetSteps = 10000;

  const temperatureScore = Math.max(
    0,
    100 - Math.abs(temperature - idealTemperature) * 2
  );

  const pressureScore = Math.max(
    0,
    100 - Math.abs(pressure - idealPressure) * 0.05
  );

  const humidityScore = Math.max(
    0,
    100 - Math.abs(humidity - idealHumidity) * 1.5
  );

  const altitudeScore = Math.max(
    0,
    100 - Math.abs(altitude - idealAltitude) * 0.01
  );

  const bpmScore = Math.max(0, 100 - Math.abs(bpm - idealBPM) * 1);

  const stepsScore = Math.min(100, (steps / targetSteps) * 100);

  const totalScore =
    (temperatureScore +
      pressureScore +
      humidityScore +
      altitudeScore +
      bpmScore +
      stepsScore) /
    6;

  return Math.round(totalScore);
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
