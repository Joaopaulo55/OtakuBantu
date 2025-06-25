// API Service - Updated to work with your backend
class ApiService {
    constructor() {
        this.baseUrl = 'https://otakubantubackend.onrender.com'; // Update with your Render URL
    }
    
    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseUrl}${endpoint}`);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    }
    
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }
    
    // Anime Methods - Updated to use your backend
    async searchAnimes(query) {
        return this.get('/search', { q: query });
    }
    
    async getAnimeDetails(animeId) {
        return this.get(`/anime/${animeId}`);
    }
    
    async getEpisodeVideo(episodeId) {
        return this.get(`/watch/${episodeId}`);
    }
    
    async getPopularAnimes() {
        return this.get('/popular');
    }
    
    async getRecentEpisodes() {
        return this.get('/recent');
    }
    
    // User Methods
    async login(email, password) {
        return this.post('/auth/login', { email, password });
    }
    
    async register(userData) {
        return this.post('/auth/register', userData);
    }
    
    async subscribeNewsletter(email) {
        return this.post('/newsletter/subscribe', { email });
    }
}

// Export a singleton instance
export const apiService = new ApiService();