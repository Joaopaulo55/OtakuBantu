const { createApp } = Vue;

createApp({
  data() {
    return {
      API_BASE: "https://ota-indol.vercel.app",
      searchQuery: "",
      popularAnimes: [],
      recentEpisodes: [],
      showModal: false,
      showPlayer: false,
      selectedAnime: {},
      currentEpisode: {},
      videoUrl: "",
      prevEpisode: null,
      nextEpisode: null,
      isLoading: false,
      errorMessage: "",
      debugMode: true,
      lastRequest: null,
      lastResponse: null,
      lastError: null
    }
  },

  async mounted() {
    await this.testAPI();
    await this.fetchPopularAnimes();
    await this.fetchRecentEpisodes();
  },

  methods: {
    async testAPI() {
      try {
        this.lastRequest = "Testando conexão com API...";
        const response = await fetch(`${this.API_BASE}/aniwatch/`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`API retornou status ${response.status}`);
        }
        
        this.lastResponse = {
          status: response.status,
          data: data
        };
        
        console.log("Conexão com API bem-sucedida:", data);
      } catch (error) {
        this.lastError = error.message;
        this.errorMessage = `Erro ao conectar com a API: ${error.message}`;
        console.error("Erro ao testar API:", error);
      }
    },

    async fetchPopularAnimes() {
      try {
        this.isLoading = true;
        this.errorMessage = "";
        this.lastRequest = "Buscando animes populares...";
        
        const response = await fetch(`${this.API_BASE}/aniwatch/popular`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Formato de dados inválido");
        }
        
        this.lastResponse = data;
        this.popularAnimes = data.results.slice(0, 10).map(anime => ({
          id: anime.id,
          title: anime.title || "Sem título",
          image: anime.image || anime.poster,
          url: anime.url
        }));
        
      } catch (error) {
        this.lastError = error.message;
        this.errorMessage = `Erro ao carregar animes: ${error.message}`;
        console.error("Erro ao buscar animes populares:", error);
        
        // Dados de fallback para teste
        this.popularAnimes = [
          {
            id: "fallback-1",
            title: "Demon Slayer",
            image: "https://via.placeholder.com/300x400/333/ccc?text=Demon+Slayer"
          },
          {
            id: "fallback-2",
            title: "Attack on Titan",
            image: "https://via.placeholder.com/300x400/333/ccc?text=Attack+on+Titan"
          }
        ];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRecentEpisodes() {
      try {
        this.isLoading = true;
        this.errorMessage = "";
        this.lastRequest = "Buscando episódios recentes...";
        
        const response = await fetch(`${this.API_BASE}/aniwatch/recent-episodes`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        this.lastResponse = data;
        this.recentEpisodes = data.results.slice(0, 10).map(ep => ({
          id: ep.id,
          title: ep.title || "Sem título",
          image: ep.image || ep.thumbnail,
          episodeNumber: ep.episodeNumber || "N/A",
          url: ep.url
        }));
        
      } catch (error) {
        this.lastError = error.message;
        this.errorMessage = `Erro ao carregar episódios: ${error.message}`;
        console.error("Erro ao buscar episódios recentes:", error);
        
        // Dados de fallback para teste
        this.recentEpisodes = [
          {
            id: "fallback-ep1",
            title: "Demon Slayer Ep 26",
            image: "https://via.placeholder.com/300x400/333/ccc?text=Ep+26",
            episodeNumber: "26"
          },
          {
            id: "fallback-ep2",
            title: "Attack on Titan Ep 75",
            image: "https://via.placeholder.com/300x400/333/ccc?text=Ep+75",
            episodeNumber: "75"
          }
        ];
      } finally {
        this.isLoading = false;
      }
    },

    async searchAnime() {
      if (!this.searchQuery.trim()) return;
      
      try {
        this.isLoading = true;
        this.errorMessage = "";
        this.lastRequest = `Buscando: ${this.searchQuery}`;
        
        const response = await fetch(
          `${this.API_BASE}/aniwatch/search?keyword=${encodeURIComponent(this.searchQuery)}`
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        this.lastResponse = data;
        this.popularAnimes = data.results.map(anime => ({
          id: anime.id,
          title: anime.title || "Sem título",
          image: anime.image || anime.poster,
          url: anime.url
        }));
        
      } catch (error) {
        this.lastError = error.message;
        this.errorMessage = `Erro na busca: ${error.message}`;
        console.error("Erro ao buscar anime:", error);
      } finally {
        this.isLoading = false;
      }
    },

    toggleDebug() {
      this.debugMode = !this.debugMode;
    },

    // ... (outros métodos mantidos iguais) ...
  }
}).mount('#app');