<script setup lang="ts">
import { onBeforeMount } from 'vue';
import usePlanets from './composables/usePlanets';
import PlanetList from './components/PlanetList.vue';
import ControlPanel from './components/ControlPanel.vue';

const { getAllPlanets, isLoading } = usePlanets();

onBeforeMount(async (): Promise<void> => {
  await getAllPlanets();
});
</script>

<template>
  <div
    class="container relative h-screen py-sm border border-primary-stroke bg-alternative-bg flex flex-col"
  >
    <ControlPanel />
    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <span class="text-lg text-secondary-text">Loading...</span>
    </div>
    <PlanetList v-else />
  </div>
</template>
