export function getQueryParamFromUrl(
  url: string,
  queryParam: string,
): string | null {
  const regex = new RegExp(`(?:^|[&?])${queryParam}=([^&]*)`);
  const match = url.match(regex);
  return match ? match[1] : null;
}
