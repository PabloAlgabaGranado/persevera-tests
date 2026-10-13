// Copiado de Persevera Oral (eslint.config.js) el 13-oct-2026, main en b8e151a.
// Copiar, nunca mover. Cambiado aquí: lo que se ignora, porque Tests no tiene
// datos/ ni herramientas/.
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // docs/ no es código de la app (la hoja de ruta, las guías y la marca).
  globalIgnores(['dist', 'ios', 'android', 'docs']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
