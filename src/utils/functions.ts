import * as moment from 'moment';
import { FilterQueryDto } from 'src/statistics/dto/filter-query.dto';

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

export const createCacheKey = {
  user: (userId: string): string => `${userId}.me`,
  categories: (userId: string): string => `${userId}.categories`,

  statistics: (categoryOrUserId: string, query: FilterQueryDto): string => {
    const from = new Date(+query.from).toDateString();
    const to = new Date(+query.to).toDateString();
    return `${categoryOrUserId + from + to}.statistics`;
  },
};

export function generateOtp(length: number = 6): string {
  return Math.random().toString().slice(-length);
}

export function getDaysObjectByDuration(startDate: number, endDate: number) {
  const daysObject: any = {};
  const currentDate = moment(startDate);
  const lastDate = moment(endDate);

  while (!currentDate.isAfter(lastDate)) {
    daysObject[currentDate.format('YYYY-MM-DD')] = {
      _id: currentDate.format('YYYY-MM-DD'),
    };
    currentDate.add(1, 'days');
  }

  return daysObject;
}
