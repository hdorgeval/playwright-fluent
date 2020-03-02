import { Viewport } from '../devices';

export interface Geolocation {
  longitude: number;
  latitude: number;
  accuracy?: number;
}
export interface BrowserContextOptions {
  viewport?: Viewport | null;
  ignoreHTTPSErrors?: boolean;
  javaScriptEnabled?: boolean;
  bypassCSP?: boolean;
  userAgent?: string;
  timezoneId?: string;
  geolocation?: Geolocation;
  permissions?: {
    [key: string]: string[];
  };
}
