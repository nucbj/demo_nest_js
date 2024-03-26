module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: '__dirname',
    ecmaVersion: 'latest',
    project: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended', // 마지막이어야 한다.
  ],
  ignorePatterns: ['node_modules', 'dist/**/*.js'],
  rules: {
    quotes: ['single'],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        bracketSpacing: true,
        endOfLine: 'auto',
        printWidth: 100,
        proseWrap: 'preserve',
        quoteProps: 'as-needed',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
        requirePragma: false,
        insertPragma: false,
      },
    ],
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/unbound-method': [
      'off',
      {
        ignoreStatic: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
