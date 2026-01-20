export const capitalizeFirstLetter = (str: string | string[]): string => {
  if (Array.isArray(str)) {
    return capitalizeFirstLetter(str[0]);
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, maxLength: number): string => {
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
};

export const rollingAverage = (
  values: number[],
  windowSize: number
): number => {
  if (values.length === 0) return 0;

  const start = Math.max(0, values.length - windowSize);
  const windowValues = values.slice(start);
  const sum = windowValues.reduce((acc, val) => acc + val, 0);
  return sum / windowValues.length;
};

export const sumValues = (values: number[]): number => {
  return values.reduce((acc, val) => acc + val, 0);
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
