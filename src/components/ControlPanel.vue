<script lang="ts" setup>
import { ref } from 'vue';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import usePlanets from '../composables/usePlanets';

const {
  sortOptionsWithLabels,
  selectedSortOption,
  getPlanetsBySearch,
  search,
  isLoading,
  getPlanetsByPage,
  fetchedPages,
  planets
} = usePlanets();

const isDropdownOpen = ref(false);

const handleReload = async (): Promise<void> => {
  planets.value = [];
  selectedSortOption.value = null;
  search.value = null;
  getPlanetsByPage(1);
};

const handleSearch = async (): Promise<void> => {
  planets.value = [];
  fetchedPages.value.clear();

  search.value && (await getPlanetsBySearch(search.value));
};
</script>

<template>
  <div class="control-panel mb-sm w-full border border-primary-stroke">
    <div class="control-panel__search-bar m-sm flex justify-between">
      <InputText
        type="text"
        id="search"
        placeholder="Search by planet name"
        class="control-panel__input h-lg p-xs w-full border-y border-l border-primary-stroke bg-alternative-bg text-primary-text"
        v-model="search"
        :class="{ disabled: isLoading }"
      />
      <button
        class="control-panel__btn h-lg w-lg border border-primary-stroke"
        @click="handleSearch"
        :class="{ disabled: isLoading }"
      >
        <fa class="icon h-4" icon="search" />
      </button>
      <button
        class="control-panel__btn h-lg px-sm ml-sm border border-primary-stroke"
        @click="handleReload"
        :class="{ disabled: isLoading }"
      >
        <p class="text-secondary-text">Clear</p>
      </button>
    </div>
    <Select
      v-model="selectedSortOption"
      :options="sortOptionsWithLabels"
      optionLabel="label"
      placeholder="Sort by"
      showClear
      :class="{ disabled: isLoading }"
      @show="() => (isDropdownOpen = true)"
      @hide="() => (isDropdownOpen = false)"
      class="control-panel__sort m-sm border border-primary-stroke flex items-center bg-alternative-bg"
      :pt="{
        listContainer: {
          style: {
            backgroundColor: 'var(--alternative-bg)'
          },
          class: 'border-x border-b border-primary-stroke'
        },
        option: {
          class: 'text-primary-text hover:bg-primary-hover p-xs'
        }
      }"
    >
      <template v-show="selectedSortOption" #clearicon="slotProps">
        <fa
          class="icon h-4 px-sm text-secondary-text"
          icon="xmark"
          @click.stop="slotProps.clearCallback"
        />
      </template>
      <template #dropdownicon>
        <button :disabled="isLoading" class="control-panel__btn h-lg w-lg">
          <fa class="icon h-4" :icon="isDropdownOpen ? 'chevron-up' : 'chevron-down'" />
        </button>
      </template>
    </Select>
  </div>
</template>

<style scoped>
.control-panel {
  .control-panel__btn {
    background-color: var(--btn-secondary-bg);
    display: flex;
    flex-shrink: 0;
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

  .control-panel__sort {
    :deep(.p-select-label) {
      padding: var(--spacing-xs);
    }
  }

  ::-webkit-input-placeholder {
    color: var(--placeholder-text);
  }

  ::-moz-placeholder {
    color: var(--placeholder-text);
  }
}

.disabled {
  opacity: 0.7;
  pointer-events: none;
}
</style>
