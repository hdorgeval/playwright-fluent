import { PlaywrightFluent } from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - immutability', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should be immutable', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'immutability.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    const container = p.selector('[role="row"]').find('td');
    const cell1 = container.withText('row1');
    const cell2 = container.withText('row2');
    const cell3 = container.withText('row3');

    // When
    const containerCount = await container.count();
    const handle1 = await cell1.getFirstHandleOrNull();
    const handle2 = await cell2.getFirstHandleOrNull();
    const handle3 = await cell3.getFirstHandleOrNull();

    // Then
    expect(containerCount).toBe(6);

    expect(handle1).not.toBeNull();
    expect(handle2).not.toBeNull();
    expect(handle3).not.toBeNull();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle1!.evaluate((el) => el.innerHTML)).toBe('row1-cell2');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle2!.evaluate((el) => el.innerHTML)).toBe('row2-cell2');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle3!.evaluate((el) => el.innerHTML)).toBe('row3-cell2');

    const expectedChainingHistory1 = `selector([role="row"])
  .find(td)
  .withText(row1)`;
    expect(cell1.toString()).toBe(expectedChainingHistory1);

    const expectedChainingHistory2 = `selector([role="row"])
  .find(td)
  .withText(row2)`;
    expect(cell2.toString()).toBe(expectedChainingHistory2);

    const expectedChainingHistory3 = `selector([role="row"])
  .find(td)
  .withText(row3)`;
    expect(cell3.toString()).toBe(expectedChainingHistory3);
  });
});
