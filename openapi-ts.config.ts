import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: 'http://localhost:5209/openapi/v1.json',
	output: {
		path: 'src/api/generated',
		format: 'prettier',
	},
	plugins: [
		'@hey-api/client-fetch',
		'@hey-api/schemas',
		{
			name: '@tanstack/react-query',
			// generates queryOptions / mutationOptions factories
		},
	],
});
