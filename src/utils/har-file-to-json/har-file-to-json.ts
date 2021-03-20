import { fileDoesNotExist } from '../fs/fs';
import { readFileSync } from 'fs';

export interface HarPage {
  startedDateTime: string;
  id: string;
  title: string;
}

export interface HarEntries {
  startedDateTime: string;
  request: {
    method: string;
    url: string;
    headers: { name: string; value: string }[];
  };
  response: {
    status: number;
    statusText: string;
    httpVersion: string;
    headers: { name: string; value: string }[];
  };
}

export interface HarContent {
  log: {
    version: string;
    creator: {
      name: string;
      version: string;
    };
    browser: {
      name: string;
      version: string;
    };
    pages: HarPage[];
    entries: HarEntries[];
  };
}

export function readHarFileAsJson(filepath: string | undefined): HarContent {
  if (!filepath) {
    throw new Error(
      `HAR filepath has not been setup. Ensure you have called 'recordNetworkActivity({path: <valid file path>})'.`,
    );
  }

  if (fileDoesNotExist(filepath)) {
    throw new Error(
      `File '${filepath}' does not exist. Ensure you have called 'recordNetworkActivity({path: ${filepath}})' and that you have closed the browser. HAR data is only saved to disk when the browser is closed.`,
    );
  }

  const harData = JSON.parse(readFileSync(filepath, 'utf8')) as HarContent;
  return harData;
}
