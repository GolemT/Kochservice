import { defineConfig } from 'orval'

export default defineConfig({
  kochservice: {
    input: {
      target: 'http://localhost:8080/openapi',
    },
    output: {
      target: './src/api/',
      client: 'axios',
      mode: 'tags-split',
      clean: true,
      override: {
        mutator: {
          path: './src/lib/axios-client.ts',
          name: 'axiosClient',
        },
      },
    },
  },
})
