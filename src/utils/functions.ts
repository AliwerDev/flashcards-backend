export function getQueryParamFromUrl(
  url: string,
  queryParam: string,
): string | null {
  const regex = new RegExp(`(?:^|[&?])${queryParam}=([^&]*)`);
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function createUrlFromTitle(title: string): string {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single hyphen
}
