/* eslint-disable @typescript-eslint/no-var-requires */
describe('get-chrome-path', (): void => {
  afterEach((): void => {
    jest.resetModules();
  });
  test('should return X64 windows path on Windows platform', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual<object>('os'),
      type: (): string => 'Windows_NT',
    }));
    jest.mock('fs', (): unknown => ({
      ...jest.requireActual<object>('fs'),
      existsSync: (path: string): boolean => {
        if (path === 'C:/Program Files/Google/Chrome/Application/chrome.exe') {
          return true;
        }
        return false;
      },
    }));

    // When
    const result = require('../get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('C:/Program Files/Google/Chrome/Application/chrome.exe');
  });

  test('should return X86 windows path on Windows platform', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual<object>('os'),
      type: (): string => 'Windows_NT',
    }));
    jest.mock('fs', (): unknown => ({
      ...jest.requireActual<object>('fs'),
      existsSync: (path: string): boolean => {
        if (path === 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe') {
          return true;
        }
        return false;
      },
    }));

    // When
    const result = require('../get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('C:/Program Files (x86)/Google/Chrome/Application/chrome.exe');
  });

  test('should return default MacOS path on MAcOS platform', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual<object>('os'),
      type: (): string => 'Darwin',
    }));

    // When
    const result = require('../get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  });

  test('should return default Unix path on Unix platform for google stable install', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual<object>('os'),
      type: (): string => 'Linux',
    }));
    jest.mock('which', (): unknown => ({
      ...jest.requireActual<object>('which'),
      sync: (input: string): string => input,
    }));

    // WHen
    const result = require('../get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('google-chrome-stable');
  });

  test('should return default Unix path on Unix platform for google install', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual<object>('os'),
      type: (): string => 'Linux',
    }));
    jest.mock('which', (): unknown => ({
      ...jest.requireActual<object>('which'),
      sync: (input: string): string => (input === 'google-chrome' ? 'google-chrome' : ''),
    }));

    // When
    const result = require('../get-chrome-path').getChromePath();

    // Then
    expect(result).toBe('google-chrome');
  });

  test('should return an error when platform is unknown', (): void => {
    // Given
    jest.mock('os', (): unknown => ({
      ...jest.requireActual<object>('os'),
      type: (): string => 'foo',
    }));

    // When
    // Then
    const expectedError = new Error(
      `Platform 'foo' is not yet supported in playwright-fluent. You should supply the path to the Chrome App in the launch options.`,
    );
    expect((): string => require('../get-chrome-path').getChromePath()).toThrow(expectedError);
  });
});
