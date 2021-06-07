import * as SUT from '..';
import { extractQueryStringObjectFromHarQueryString } from '../../har-file-to-json';
describe('hasQueryString(url)', (): void => {
  test('should extract simple query string', async (): Promise<void> => {
    // Given
    const url = 'http://localhost:8080/foobar?foo=bar';

    // When
    const result = SUT.extractQueryStringObjectFromUrl(url);

    // Then
    expect(result).toMatchObject({ foo: 'bar' });
  });

  test('should extract complex query string', async (): Promise<void> => {
    // Given
    const url =
      'https://collector.githubapp.com/github/page_view?dimensions[page]=https%3A%2F%2Fgithub.com%2F&dimensions[title]=GitHub%3A%20Where%20the%20world%20builds%20software%20%C2%B7%20GitHub&dimensions[referrer]=https%3A%2F%2Fgithub.com%2Fhdorgeval&dimensions[user_agent]=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F90.0.4430.212%20Safari%2F537.36&dimensions[screen_resolution]=1366x768&dimensions[pixel_ratio]=1&dimensions[browser_resolution]=680x632&dimensions[tz_seconds]=7200&dimensions[timestamp]=1622236525981&dimensions[referrer]=https%3A%2F%2Fgithub.com%2Fhdorgeval&dimensions[request_id]=1E30%3AFA42%3A6ABE7B%3A6F11FD%3A60B15D57&dimensions[visitor_id]=2302158959687451178&dimensions[region_edge]=fra&dimensions[region_render]=fra&&measures[performance_timing]=1-12-12-2879-2351-2351-1181-485-12-12-12--2879-0---33-166-98--175-175&&&dimensions[cid]=536013152.1621574186';

    const harQueryString = [
      {
        name: 'dimensions[page]',
        value: 'https%3A%2F%2Fgithub.com%2F',
      },
      {
        name: 'dimensions[title]',
        value: 'GitHub%3A%20Where%20the%20world%20builds%20software%20%C2%B7%20GitHub',
      },
      {
        name: 'dimensions[referrer]',
        value: 'https%3A%2F%2Fgithub.com%2Fhdorgeval',
      },
      {
        name: 'dimensions[user_agent]',
        value:
          'Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F90.0.4430.212%20Safari%2F537.36',
      },
      {
        name: 'dimensions[screen_resolution]',
        value: '1366x768',
      },
      {
        name: 'dimensions[pixel_ratio]',
        value: '1',
      },
      {
        name: 'dimensions[browser_resolution]',
        value: '680x632',
      },
      {
        name: 'dimensions[tz_seconds]',
        value: '7200',
      },
      {
        name: 'dimensions[timestamp]',
        value: '1622236525981',
      },
      {
        name: 'dimensions[referrer]',
        value: 'https%3A%2F%2Fgithub.com%2Fhdorgeval',
      },
      {
        name: 'dimensions[request_id]',
        value: '1E30%3AFA42%3A6ABE7B%3A6F11FD%3A60B15D57',
      },
      {
        name: 'dimensions[visitor_id]',
        value: '2302158959687451178',
      },
      {
        name: 'dimensions[region_edge]',
        value: 'fra',
      },
      {
        name: 'dimensions[region_render]',
        value: 'fra',
      },
      {
        name: '',
        value: '',
      },
      {
        name: 'measures[performance_timing]',
        value: '1-12-12-2879-2351-2351-1181-485-12-12-12--2879-0---33-166-98--175-175',
      },
      {
        name: '',
        value: '',
      },
      {
        name: '',
        value: '',
      },
      {
        name: 'dimensions[cid]',
        value: '536013152.1621574186',
      },
    ];
    // When
    const result = SUT.extractQueryStringObjectFromUrl(url);

    // Then
    const expectedResult = extractQueryStringObjectFromHarQueryString(harQueryString);
    expect(result).toMatchObject(expectedResult);
  });
});
