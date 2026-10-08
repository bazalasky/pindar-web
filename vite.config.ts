// defineConfig comes from vitest/config, not vite - only that version types the `test` key.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // No DOM needed while tests cover pure functions. Switch to 'jsdom' for component tests.
    environment: 'node',
  },
})
