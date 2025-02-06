const isAbsoluteUrlRegex = /^(?:[a-z]+:)?\/\//i;

export function completeRelativeUrl(url: string) {
  if (isAbsoluteUrlRegex.test(url)) {
    return url;
  }
  return new URL(url, process.env.NEXT_PUBLIC_BASE_URL ?? "").href;
}
