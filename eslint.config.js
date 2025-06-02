import ts from '@typed-sigterm/eslint-config';

export default ts({
  rules: {
    // use `consola` instead
    'no-console': [2, { allow: undefined }],
    // if `import process from 'node:process'`, tsup won't replace `process.env.VITE_DEV_SERVER_URL`
    'node/prefer-global/process': [2, 'always'],
    // for performance
    'vue/no-mutating-props': [0],
  },

  ignores: [
    './src/components/ui',
    './src/lib',
  ],
});
