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
  count: 0,
  planets: []
});

const currentPage = ref(1);
const rowsPerPage = ref(10);
const firstItemIndexByPage = ref(0);
const selectedSortOption = ref<SortOption | null>(null);
const search = ref<string | null>(null);
const searchResult = ref<Planet[] | null>(null);
const isLoading = ref(false);

export default function usePlanets() {
  const getAllPlanets = async (): Promise<void> => {
    try {
      isLoading.value = true;
      let allPlanets: Planet[] = [];
      let nextPageUrl: string | null = `${BASE_URL}/planets/`;

      while (nextPageUrl) {
        const response = await fetch(nextPageUrl);

        if (!response.ok) {
          throw new Error(`Fetching planets failed! ${response.status}`);
        }

        const data: ResponseData = await response.json();
        allPlanets = [...allPlanets, ...data.results];
        nextPageUrl = data.next;
      }

      state.planets = [...allPlanets];
      state.count = allPlanets.length;
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

  const getPlanetsBySearch = async (searchParam: string): Promise<void> => {
    try {
      isLoading.value = true;
      const response = await fetch(`${BASE_URL}/planets/?search=${searchParam}`);

      if (!response.ok) {
        throw new Error(`Fetching planets failed! ${response.status}`);
      }

      const data: ResponseData = await response.json();
      searchResult.value = data.results;

      state.planets = [...searchResult.value];
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
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

  const planetsToDisplay = computed(() => {
    let planetsToDisplay = [...state.planets];

    if (selectedSortOption.value) {
      planetsToDisplay = sortPlanets(planetsToDisplay, selectedSortOption.value);
    }

    return planetsToDisplay;
  });

  const planetsByRowsPerPage = computed<Planet[]>(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage.value;
    const endIndex = startIndex + rowsPerPage.value;
    return planetsToDisplay.value.slice(startIndex, endIndex);
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
    getAllPlanets,
    getPlanetsBySearch,
    formatDate,
    sortOptionsWithLabels,
    firstItemIndexByPage,
    selectedSortOption,
    ROWS_PER_PAGE_OPTIONS,
    planetsByRowsPerPage,
    currentPage,
    rowsPerPage,
    search,
    isLoading,
    ...toRefs(state)
  };
}
