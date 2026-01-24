import { defineConfig } from 'orval'

export default defineConfig({
    kochservice: {
        input: {
            target: 'http://localhost:8080/openapi',
        },
        output: {
            target: './api/',
            client: 'fetch',
            mode: 'tags-split',
            clean: true,
            prettier: true,
            baseUrl: '',
            override: {
                mutator: {
                    path: './lib/api-client.ts',
                    name: 'apiClient',
                }
            }
        },
    },
})
