export function urlToPath(url: string): string {
  const urlObject = new URL(url);
  const fullPath = `${urlObject.pathname}${urlObject.search}`;
  return fullPath;
}

export function urlToPathWithoutQueryString(url: string): string {
  const urlObject = new URL(url);
  const fullPath = `${urlObject.pathname}`;
  return fullPath;
}

export function hasQueryString(url: string): boolean {
  const urlObject = new URL(url);
  const queryString = `${urlObject.search}`;
  if (queryString) {
    return true;
  }
  return false;
}

export function extractQueryStringObjectFromUrl(url: string): { [key: string]: string } {
  const urlObject = new URL(url);
  const result: { [key: string]: string } = {};
  urlObject.searchParams.forEach((value, name) => {
    if (name) {
      result[name] = value;
    }
  });

  return result;
}

export function areQueryStringSimilar(url1: string, url2: string): boolean {
  const queryStringObject1 = extractQueryStringObjectFromUrl(url1);
  const queryStringObject2 = extractQueryStringObjectFromUrl(url2);

  for (const key in queryStringObject1) {
    if (
      ['id', 'date', 'time', 'nonce', 'state'].some((keyword) =>
        key.toLowerCase().includes(keyword),
      )
    ) {
      continue;
    }

    if (queryStringObject1[key] !== queryStringObject2[key]) {
      return false;
    }
  }

  return true;
}
