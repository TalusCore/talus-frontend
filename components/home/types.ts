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
  | 'steps'
  | 'cadence'
  | 'force'
  | 'power'
  | 'spo2'
  | 'flights'
  | 'tpi';

export type RollingStatName = Exclude<StatName, 'steps' | 'flights'>;

export type ResponseStat = {
  statName: string;
  value: number;
  timestamp: Date;
};
