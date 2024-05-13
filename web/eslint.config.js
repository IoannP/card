import pluginVue from 'eslint-plugin-vue';
import pluginJs from "@eslint/js";
import globals from 'globals';

export default [
  ...pluginVue.configs['flat/recommended'],
  pluginJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
  },
];