<script lang="ts" setup>
import type { Planet } from '../interface';
import Card from 'primevue/card';
import { formatDate } from '../utils/helpers';

defineProps<{
  planet: Planet;
}>();
</script>

<template>
  <Card>
    <template #content>
      <div
        class="flex flex-col gap-xs bg-secondary-bg p-xs border-t-2 border-primary-stroke text-sm"
      >
        <p>Population: {{ planet.population }}</p>
        <p>Climate: {{ planet.climate }}</p>
        <p>Gravity: {{ planet.gravity }}</p>
        <p>Rotation period: {{ planet.rotation_period }}</p>
        <p>Created: {{ formatDate(planet.created) }}</p>
        <p>
          <a
            :href="planet.url"
            target="_blank"
            :title="`Planet ${planet.name} page`"
            class="text-secondary-text"
          >
            {{ planet.url }}
          </a>
        </p>
      </div>
    </template>
  </Card>
</template>
