export type Stat = {
  value: number;
  timestamp: Date;
};

export type StatName =
  | 'temperature'
  | 'pressure'
  | 'humidity'
  | 'altitude'
  | 'bpm'
  | 'steps';

export type RollingStatName = Exclude<StatName, 'steps'>;

export type ResponseStat = {
  statName: string;
  value: number;
  timestamp: Date;
};
