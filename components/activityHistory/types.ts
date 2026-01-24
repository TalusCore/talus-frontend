export type TooltipState = {
  index: number;
  visible: boolean;
  x: number;
  y: number;
  value: number;
  label: string;
};

export enum StatNamesEnum {
  Accel_x = 'X Acceleration',
  Accel_y = 'Y Acceleration',
  Accel_z = 'Z Acceleration',
  Altitude = 'Altitude',
  Bpm = 'Heart Rate (BPM)',
  Gyro_x = 'X Gyroscope',
  Gyro_y = 'Y Gyroscope',
  Gyro_z = 'Z Gyroscope',
  Humidity = 'Humidity',
  Latitude = 'Latitude',
  Longitude = 'Longitude',
  Pressure = 'Pressure',
  Satellites = 'Satellites',
  Steps = 'Step Count',
  Temperature = 'Temperature'
}
