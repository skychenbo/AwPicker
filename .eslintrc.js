module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // ESLint 规则增强，使用优先级B：强烈推荐的规则，具体增加规则可以参考如下链接
    // https://cn.vuejs.org/v2/style-guide/
    // https://github.com/vuejs/eslint-plugin-vue/tree/master/docs/rules
    'plugin:vue/strongly-recommended',
    '@vue/airbnb',
  ],
  rules: {
    'vue/require-default-prop': 'off',
    'linebreak-style': 'off',
    'global-require': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'max-len': ['error', { code: 150 }],
    'no-mixed-operators': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
