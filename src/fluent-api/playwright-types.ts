import { Viewport } from '../devices';

export interface Geolocation {
  longitude: number;
  latitude: number;
  accuracy?: number;
}

export type Permission =
  | '*'
  | 'geolocation'
  | 'midi'
  | 'midi-sysex'
  | 'notifications'
  | 'push'
  | 'camera'
  | 'microphone'
  | 'background-sync'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'accessibility-events'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'payment-handler';

export interface BrowserContextOptions {
  viewport?: Viewport | null;
  ignoreHTTPSErrors?: boolean;
  javaScriptEnabled?: boolean;
  bypassCSP?: boolean;
  userAgent?: string;
  timezoneId?: string;
  geolocation?: Geolocation;
  permissions?: Permission[];
}
