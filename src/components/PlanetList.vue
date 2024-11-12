<script lang="ts" setup>
import { ref } from 'vue';
import usePlanets from '../composables/usePlanets';
import { type Planet } from '../interface';
import Panel from 'primevue/panel';
import PlanetCard from './PlanetCard.vue';
import Pagination from './Pagination.vue';

const { planetsByRowsPerPage: planets, generatePlanetIdByUrl } = usePlanets();

const selectedPlanets = ref<Set<string>>(new Set());

const toggle = (planet: Planet): void => {
  const planetId = generatePlanetIdByUrl(planet.url);

  selectedPlanets.value.has(planetId)
    ? selectedPlanets.value.delete(planetId)
    : selectedPlanets.value.add(planetId);
};

const isPlanetSelected = (planet: Planet): boolean =>
  selectedPlanets.value.has(generatePlanetIdByUrl(planet.url));
</script>

<template>
  <ul class="planet-list flex flex-col gap-sm py-sm overflow-y-auto">
    <li
      class="planet-list__item"
      v-for="(planet, idx) in planets"
      :key="planet.id"
      :id="generatePlanetIdByUrl(planet.url)"
      @click="toggle(planet)"
    >
      <Panel
        toggleable
        :collapsed="!selectedPlanets.has(generatePlanetIdByUrl(planet.url))"
        :idx="idx"
        class="border-2 border-primary-stroke bg-secondary-bg panel hover:bg-primary-hover"
        :pt="{
          headeractions: {
            class: 'hidden'
          }
        }"
      >
        <template #header>
          <button
            class="planet-list__item__header flex items-center justify-between h-12 w-full relative"
          >
            <h2 class="text-xl px-sm">{{ planet.name }}</h2>
            <div class="flex items-center justify-center w-12 h-full">
              <fa
                class="lanet-list__item__header-icon h-4"
                :icon="isPlanetSelected(planet) ? 'chevron-up' : 'chevron-down'"
              />
            </div>
          </button>
        </template>
        <div class="planet-list__item__content">
          <PlanetCard :planet="planet" />
        </div>
      </Panel>
    </li>
  </ul>
  <Pagination class="mt-md mb-md" />
</template>

<style scoped>
.planet-list {
  height: calc(100svh - 156px);
  scrollbar-width: thin;
  scrollbar-gutter: stable both-edges;
  background-color: #1c2331;
  scrollbar-color: #aeb1b683 #c7cacf49;

  &button {
    all: unset;
    cursor: pointer;
  }
}

.planet-list::-webkit-scrollbar {
  width: 8px;
}

.planet-list::-webkit-scrollbar-track {
  background: transparent;
}

.planets-list::-webkit-scrollbar-thumb {
  background-color: var(--scroll-bg);
  border-radius: 4px;
}

.panel {
  transition: ease-in-out 0.4s all;
}
</style>
