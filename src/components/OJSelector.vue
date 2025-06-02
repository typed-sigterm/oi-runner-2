<script lang="ts">
import type { OJ } from '../../shared/events';
import { OJNames } from '../../shared/events';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
</script>

<script setup lang="ts">
const value = defineModel<OJ | undefined>();
</script>

<template>
  <Select v-model="value">
    <SelectTrigger v-bind="$attrs">
      <SelectValue placeholder="Select an OJ" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="name in OJNames" :key="name" :value="name">
        {{ name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
