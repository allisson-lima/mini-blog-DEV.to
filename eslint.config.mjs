import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,

});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", 'plugin:prettier/recommended'),
  {
    ignores: [
      '**/node_modules/*',
      '**/out/*',
      '**/.next/*',
      '**/coverage',
      'src/styles/globals.css',
      '.next',
      '.cache',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'public',
      'next.config.js',
      'next.config.ts',
      'next-env.d.ts',
      'tsconfig.json',
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_'
        }
      ],

      'no-console': [
        2,
        {
          allow: ['warn', 'error']
        }
      ]
    }
  },
];

export default eslintConfig;
