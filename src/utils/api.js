// Handles base URL, auth tokens from localStorage, and standardizes requests.

const BASE_URL = 'https://bonane00.pythonanywhere.com';
 
const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('access_token');

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, config);

            // Re-login when token expired
            if (response.status === 401) {
                console.warn('Session expired. Redirecting to login...');
                localStorage.removeItem('access_token');
            }

            // Return empty object for 204 No Content
            if (response.status === 204) return {};

            // Handle JSON response or empty object
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.detail || data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
            throw error;
        }
    },

    get(endpoint, headers = {}) {
        return this.request(endpoint, { method: 'GET', headers });
    },

    post(endpoint, body, headers = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        });
    },

    put(endpoint, body, headers = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        });
    },

    patch(endpoint, body, headers = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers,
        });
    },

    delete(endpoint, headers = {}) {
        return this.request(endpoint, { method: 'DELETE', headers });
    },
};

export default api;
