import { TimeZoneId } from './timezone-ids';
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
  bypassCSP?: boolean;
  extraHTTPHeaders?: Record<string, string>;
  geolocation?: Geolocation;
  ignoreHTTPSErrors?: boolean;
  javaScriptEnabled?: boolean;
  locale?: string;
  permissions?: Permission[];
  timezoneId?: TimeZoneId;
  userAgent?: string;
  viewport?: Viewport | null;
}
