import { computed, reactive, ref, toRefs } from 'vue';
import { ResponseData, type Planet, type Planets, type SortOption } from '../interface';

const BASE_URL = 'https://swapi.dev/api';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30];

const SORT_OPTIONS: SortOption[] = [
  { field: 'name', order: 'asc' },
  { field: 'name', order: 'desc' },
  { field: 'diameter', order: 'asc' },
  { field: 'diameter', order: 'desc' },
  { field: 'population', order: 'asc' },
  { field: 'population', order: 'desc' }
];

const state = reactive<Planets>({
  pageCount: 0,
  planets: []
});

const resultsPerPage = ref<Planet[]>([]);
const fetchedPages = ref(new Set<number>());
const currentPage = ref(1);
const rowsPerPage = ref(10);
const firstItemIndexByPage = ref(0);
const selectedSortOption = ref<SortOption | null>(null);
const search = ref<string | null>(null);
const isLoading = ref(false);

export default function usePlanets() {
  const getPlanetsByPage = async (page: number): Promise<void> => {
    try {
      isLoading.value = true;

      const response = await fetch(`${BASE_URL}/planets/?page=${page}`);

      fetchedPages.value.add(page);

      if (!response.ok) {
        throw new Error(`Fetching planets failed! ${response.status}`);
      }

      const data = await response.json();
      state.planets.push(...data.results);
      state.pageCount = data.next ? state.planets.length + 1 : state.planets.length;
    } catch (error) {
      console.error();
    } finally {
      isLoading.value = false;
    }
  };

  const getPlanetsBySearch = async (searchParam: string, page: number = 1): Promise<void> => {
    try {
      isLoading.value = true;

      const response = await fetch(`${BASE_URL}/planets/?search=${searchParam}&page=${page}`);

      fetchedPages.value.add(page);

      if (!response.ok) {
        throw new Error(`Fetching planets failed! ${response.status}`);
      }

      const data: ResponseData = await response.json();
      state.planets.push(...data.results);
      state.pageCount = data.next ? state.planets.length + 1 : state.planets.length;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const sortPlanets = (planets: Planet[], sortOption: SortOption): Planet[] => {
    return planets.sort((a, b) => {
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

  const planetsToDisplay = computed<Planet[]>(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage.value;
    const endIndex = startIndex + rowsPerPage.value;

    let planetsToDisplay = state.planets.slice(startIndex, endIndex).flat();

    if (selectedSortOption.value) {
      planetsToDisplay = sortPlanets(planetsToDisplay, selectedSortOption.value);
    }

    return planetsToDisplay;
  });

  const sortOptionsWithLabels = computed(() => {
    return SORT_OPTIONS.map((option) => ({
      ...option,
      label: `${capitalizeFirstLetter(option.field)} ${option.order === 'asc' ? 'ascending' : 'descending'}`
    }));
  });

  return {
    generatePlanetIdByUrl,
    sortPlanets,
    getPlanetsBySearch,
    getPlanetsByPage,
    formatDate,
    capitalizeFirstLetter,
    sortOptionsWithLabels,
    firstItemIndexByPage,
    selectedSortOption,
    ROWS_PER_PAGE_OPTIONS,
    planetsToDisplay,
    currentPage,
    rowsPerPage,
    search,
    isLoading,
    resultsPerPage,
    fetchedPages,
    ...toRefs(state)
  };
}
