<script lang="ts" setup>
import { useData, useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';

const { Layout } = DefaultTheme;
const { frontmatter, lang } = useData();
const route = useRoute();

giscusTalk({
  repo: 'typed-sigterm/oi-runner-2',
  repoId: 'R_kgDOMMOVrA',
  category: 'Comments',
  categoryId: 'DIC_kwDOMMOVrM4Cjq1r',
  mapping: 'pathname',
  inputPosition: 'bottom',
  lang: lang.value,
  locales: {
    'zh-Hans': 'zh-CN',
    'en-US': 'en',
  },
}, {
  frontmatter,
  route,
}, true);
</script>

<template>
  <Layout />
</template>
