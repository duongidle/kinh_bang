import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'research'] },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Quy tắc 3 và K0.10: engine tất định và không đụng tới trình duyệt.
    files: ['src/engine/**/*.ts', 'src/config/**/*.ts'],
    rules: {
      'no-restricted-globals': ['error', 'window', 'document', 'self', 'navigator', 'performance', 'localStorage', 'indexedDB'],
      'no-restricted-properties': ['error',
        { object: 'Math', property: 'random', message: 'Dùng rand() của core/rng.' },
        { object: 'Date', property: 'now', message: 'Engine không đọc thời gian thật.' },
      ],
      'no-restricted-syntax': ['error', { selector: "NewExpression[callee.name='Date']", message: 'Engine không đọc thời gian thật.' }],
      'no-restricted-imports': ['error', { patterns: ['**/ui/**', '@/ui/*', 'react', 'react-dom', 'zustand'] }],
    },
  },
);
