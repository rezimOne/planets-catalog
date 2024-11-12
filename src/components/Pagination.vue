<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import usePlanets from '../composables/usePlanets';

const { count, currentPage, rowsPerPage, isLoading, firstItemIndexByPage, ROWS_PER_PAGE_OPTIONS } =
  usePlanets();

const handlePageChange = (e: { page: number; rows: number }): void => {
  rowsPerPage.value !== e.rows
    ? ((currentPage.value = 1), (firstItemIndexByPage.value = 0))
    : ((currentPage.value = e.page + 1), (firstItemIndexByPage.value = e.page * e.rows));

  rowsPerPage.value = e.rows;
};
</script>

<template>
  <Paginator
    v-model:first="firstItemIndexByPage"
    :rows="rowsPerPage"
    :rowsPerPageOptions="ROWS_PER_PAGE_OPTIONS"
    :totalRecords="count"
    @page="handlePageChange"
    :pt="{
      content: {
        class: 'flex gap-1'
      },
      pages: {
        class: 'flex gap-1'
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
      },
      pcRowPerPageDropdown: {
        label: {
          class: 'mr-sm'
        },
        listContainer: {
          class: 'bg-alternative-bg'
        },
        option: {
          class: 'hover:bg-primary-hover p-xs'
        }
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
