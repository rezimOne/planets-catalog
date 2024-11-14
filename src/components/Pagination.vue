<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import usePlanets from '../composables/usePlanets';
import { watch } from 'vue';
import { ROWS_PER_PAGE } from '../utils/helpers';

const {
  getPlanetsByPage,
  getPlanetsBySearch,
  handlePageChange,
  firstItemIndexByPage,
  selectedSortOption,
  currentPage,
  fetchedPages,
  search,
  count
} = usePlanets();

watch(
  (): number => currentPage.value,
  async (newPage): Promise<void> => {
    const pagesToFetch: number[] = [];
    for (let page = 1; page <= newPage; page++) {
      if (!fetchedPages.value.has(page)) {
        pagesToFetch.push(page);
      }
    }
    if (!selectedSortOption.value) {
      for (const page of pagesToFetch) {
        if (search.value) {
          await getPlanetsBySearch(search.value, page);
        } else {
          await getPlanetsByPage(page);
        }
      }
    }
  }
);
</script>

<template>
  <Paginator
    v-model:first="firstItemIndexByPage"
    :rows="ROWS_PER_PAGE"
    :totalRecords="count"
    @page="handlePageChange"
    :pt="{
      content: {
        class: 'flex gap-2'
      },
      pages: {
        class: 'flex gap-2'
      },
      page: {
        class: 'pagination-btn rounded-full'
      },
      first: {
        class: 'pagination-btn rounded-full'
      },
      prev: {
        class: 'pagination-btn rounded-full'
      },
      next: {
        class: 'pagination-btn rounded-full'
      },
      last: {
        class: 'pagination-btn rounded-full'
      }
    }"
  />
</template>

<style scoped>
.btn {
  height: var(--btn-sm-height);
  width: var(--btn-sm-width);
  border-radius: 50%;
  background-color: var(--btn-secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btn-primary-bg);
  transition: ease-in-out 0.4s all;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:focus {
    background-color: var(--primary-hover);
  }
}

:deep(.p-paginator) {
  .pagination-btn {
    height: 24px;
    width: 24px;
    font-size: 0.875rem;
    transition: ease-in-out 0.4s all;

    &:focus {
      background-color: var(--primary-hover);
    }

    &:hover {
      background-color: var(--primary-hover);
    }
  }
}
</style>
