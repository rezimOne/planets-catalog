import { computed } from 'vue';
import type { Planet, SortOption } from '../interface';

const BASE_URL = 'https://swapi.dev/api';
const ROWS_PER_PAGE = 10;

const SORT_OPTIONS: SortOption[] = [
  { field: 'name', order: 'asc' },
  { field: 'name', order: 'desc' },
  { field: 'diameter', order: 'asc' },
  { field: 'diameter', order: 'desc' },
  { field: 'population', order: 'asc' },
  { field: 'population', order: 'desc' }
];

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generatePlanetIdByUrl = (url: string): string => {
  const urlParts = url.split('/');
  const id = `${urlParts[urlParts.length - 3]}_${urlParts[urlParts.length - 2]}`;
  return id;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const sortPlanets = (planets: Planet[], sortOption: SortOption) => {
  const sorted = [...planets];
  return sorted.sort((a, b) => {
    const valueA = a[sortOption.field];
    const valueB = b[sortOption.field];

    if (valueA === 'unknown') return 1;
    if (valueB === 'unknown') return -1;

    const numericA = Number(valueA);
    const numericB = Number(valueB);
    if (!isNaN(numericA) && !isNaN(numericB)) {
      return sortOption.order === 'asc' ? numericA - numericB : numericB - numericA;
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOption.order === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return 0;
  });
};

const sortOptionsWithLabels = computed(() => {
  return SORT_OPTIONS.map((option) => ({
    ...option,
    label: `${capitalizeFirstLetter(option.field)} ${option.order === 'asc' ? 'ascending' : 'descending'}`
  }));
});

export {
  capitalizeFirstLetter,
  generatePlanetIdByUrl,
  formatDate,
  sortPlanets,
  sortOptionsWithLabels,
  ROWS_PER_PAGE,
  SORT_OPTIONS,
  BASE_URL
};
