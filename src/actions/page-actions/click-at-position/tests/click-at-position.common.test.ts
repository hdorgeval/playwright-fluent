import { Page } from 'playwright';
import * as SUT from '../index';
import { defaultClickOptions, Point } from '../../../handle-actions';

describe('click-at-position', (): void => {
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const position: Point = { x: 1, y: 2 };
    // When
    // Then
    const expectedError = new Error(
      "Cannot click at position 'x: 1, y: 2' because no browser has been launched",
    );
    await SUT.clickAtPosition(position, page, defaultClickOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
