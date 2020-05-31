import * as SUT from '../index';
import { Request } from '../../record-requests-to';
import { Page } from 'playwright';
describe('record failed requests', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const requests: Request[] = [];
    const callback = (request: Request) => requests.push(request);

    // When
    // Then
    const expectedError = new Error(
      'Cannot record failed requests because no browser has been launched',
    );
    await SUT.recordFailedRequests(page, callback).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
