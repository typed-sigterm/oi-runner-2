<script lang="ts" setup>
import { VPGiscus } from 'vitepress-giscus';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-after>
      <VPGiscus
        :giscus="{
          repo: 'typed-sigterm/oi-runner-2',
          repoId: 'R_kgDOMMOVrA',
          category: 'Comments',
          categoryId: 'DIC_kwDOMMOVrM4Cjq1r',
          mapping: 'pathname',
          inputPosition: 'bottom',
        }"
      />
    </template>
  </Layout>
</template>
