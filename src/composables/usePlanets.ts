import { computed, reactive, ref, toRefs } from 'vue';
import type { ResponseData, Planet, SortOption, Planets } from '../interface';
import { ROWS_PER_PAGE, BASE_URL, sortPlanets } from '../utils/helpers';

const state = reactive<Planets>({
  planets: [],
  count: 0
});

const fetchedPages = ref(new Set<number>());
const currentPage = ref(1);
const rowsPerPage = ref(10);
const selectedSortOption = ref<SortOption | null>(null);
const search = ref<string | null>(null);
const isLoading = ref(false);
const firstItemIndexByPage = ref(0);

export default function usePlanets() {
  const getPlanetsByPage = async (page: number): Promise<void> => {
    try {
      isLoading.value = true;

      const response = await fetch(`${BASE_URL}/planets/?page=${page}`);
      if (!response.ok) {
        throw new Error(`Fetching planets failed! ${response.status}`);
      }

      fetchedPages.value.add(page);

      const data: ResponseData = await response.json();
      state.planets.push(...data.results);
      state.count = data.count;
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
      if (!response.ok) {
        throw new Error(`Fetching planets failed! ${response.status}`);
      }

      fetchedPages.value.add(page);

      const data: ResponseData = await response.json();
      state.planets.push(...data.results);
      state.count = data.count;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const getAllPlanets = async (): Promise<void> => {
    try {
      isLoading.value = true;
      let allPlanets: Planet[] = [];
      let nextPageUrl: string | null = `${BASE_URL}/planets/?page=1`;

      while (nextPageUrl) {
        const response = await fetch(nextPageUrl);

        if (!response.ok) {
          throw new Error(`Fetching planets failed! ${response.status}`);
        }

        const data: ResponseData = await response.json();
        allPlanets = [...allPlanets, ...data.results];
        nextPageUrl = data.next;
      }
      state.planets = allPlanets;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const planetsToDisplay = computed<Planet[]>(() => {
    let planets = selectedSortOption.value
      ? sortPlanets([...state.planets], selectedSortOption.value)
      : [...state.planets];

    const startIndex = (currentPage.value - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;

    return planets.slice(startIndex, endIndex);
  });

  const handlePageChange = (e: { page: number; rows: number }): void => {
    currentPage.value = e.page + 1;
    rowsPerPage.value = e.rows;
    firstItemIndexByPage.value = e.page * e.rows;
  };

  return {
    sortPlanets,
    getPlanetsBySearch,
    getPlanetsByPage,
    getAllPlanets,
    handlePageChange,
    selectedSortOption,
    planetsToDisplay,
    currentPage,
    rowsPerPage,
    search,
    isLoading,
    fetchedPages,
    firstItemIndexByPage
    ...toRefs(state)
  };
}
