module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react', 'plugin:prettier/recommended', 'eslint-config-prettier'],
  parser: 'babel-eslint',
  rules: {
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 120,
      },
    ],
    'no-shadow': 'off',
    'react/forbid-prop-types': 0,
    curly: 'error',
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'no-nested-ternary': 0,
  },
  plugins: ['prettier'],
};
