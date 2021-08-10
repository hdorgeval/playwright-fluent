export function urlToPath(url: string): string {
  const urlObject = new URL(url);
  const fullPath = `${urlObject.pathname}${urlObject.search}`;
  return fullPath;
}
export function urlToShortPath(url: string): string {
  const urlObject = new URL(url);
  const fullPath = `${urlObject.pathname}${urlObject.search}`;
  const parts = fullPath.split('/');
  if (parts.length <= 2) {
    return fullPath;
  }
  const shortPath = ['', parts[parts.length - 2], parts[parts.length - 1]].join('/');
  return shortPath;
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

export function hasNoQueryString(url: string): boolean {
  return !hasQueryString(url);
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
