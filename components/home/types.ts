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
  | 'flightsClimbed'
  | 'tpi';

export type RollingStatName = Exclude<StatName, 'steps' | 'flightsClimbed'>;

export type ResponseStat = {
  statName: string;
  value: number;
  timestamp: Date;
};
