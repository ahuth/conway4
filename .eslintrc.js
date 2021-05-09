module.exports = {
  extends: 'react-app',
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    eqeqeq: ['error', 'smart'],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
};
