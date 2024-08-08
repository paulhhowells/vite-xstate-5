/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { name, version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [ react() ],
	define: {
		APP_VERSION: JSON.stringify(version),
		APP_NAME: JSON.stringify(name),
	},
});
