import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'example/', 'node_modules/', '.claude/'],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', '__tests__/**/*.ts', '__tests__/**/*.tsx'],
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-constant-condition': 'warn',
    },
  },
);
