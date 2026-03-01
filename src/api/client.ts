import { client } from './generated/client.gen';
import { supabase } from './supabase';

// Configure generated client with env-based base URL
client.setConfig({
	baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5209',
});

// Attach Bearer token to every request
client.interceptors.request.use(async (request) => {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	if (token) request.headers.set('Authorization', `Bearer ${token}`);
	return request;
});

// On 401, refresh once and retry
client.interceptors.response.use(async (response, request) => {
	if (response.status !== 401) return response;
	const { data } = await supabase.auth.refreshSession();
	const token = data.session?.access_token;
	if (!token) return response;
	const retried = request.clone();
	retried.headers.set('Authorization', `Bearer ${token}`);
	return fetch(retried);
});

// Re-export as apiClient for direct usage in hooks
export const apiClient = client;
