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
      isLoading: false
    }
  },

  async mounted() {
    await this.fetchPopularAnimes();
    await this.fetchRecentEpisodes();
  },

  methods: {
    async fetchPopularAnimes() {
      try {
        this.isLoading = true;
        const res = await fetch(`${this.API_BASE}/aniwatch/popular`);
        const data = await res.json();
        this.popularAnimes = data.results.slice(0, 10);
      } catch (error) {
        console.error("Error fetching popular animes:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRecentEpisodes() {
      try {
        this.isLoading = true;
        const res = await fetch(`${this.API_BASE}/aniwatch/recent-episodes`);
        const data = await res.json();
        this.recentEpisodes = data.results.slice(0, 10);
      } catch (error) {
        console.error("Error fetching recent episodes:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async searchAnime() {
      if (!this.searchQuery.trim()) return;
      
      try {
        this.isLoading = true;
        const res = await fetch(`${this.API_BASE}/aniwatch/search?keyword=${encodeURIComponent(this.searchQuery)}`);
        const data = await res.json();
        this.popularAnimes = data.results;
      } catch (error) {
        console.error("Error searching anime:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async showAnimeDetails(anime) {
      try {
        this.isLoading = true;
        const res = await fetch(`${this.API_BASE}/aniwatch/anime/${anime.id}`);
        const data = await res.json();
        
        this.selectedAnime = {
          ...data,
          id: anime.id,
          poster: anime.poster || anime.image,
          name: anime.name || anime.title
        };
        
        this.showModal = true;
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async playEpisode(episode) {
      try {
        this.isLoading = true;
        this.currentEpisode = episode;
        
        // Obter servidores disponíveis
        const serversRes = await fetch(`${this.API_BASE}/aniwatch/servers?id=${episode.id}`);
        const serversData = await serversRes.json();
        
        // Usar o primeiro servidor disponível (você pode adicionar seleção de servidor)
        if (serversData.servers && serversData.servers.length > 0) {
          const server = serversData.servers[0];
          
          // Obter URL do vídeo
          const videoRes = await fetch(`${this.API_BASE}/aniwatch/episode-srcs?id=${episode.id}&server=${server.name}`);
          const videoData = await videoRes.json();
          
          if (videoData.sources && videoData.sources.length > 0) {
            // Pegar a melhor qualidade disponível
            const bestQuality = videoData.sources.reduce((prev, current) => 
              (prev.quality > current.quality) ? prev : current
            );
            this.videoUrl = bestQuality.url;
          }
        }
        
        // Encontrar episódios anterior/próximo
        if (this.selectedAnime.episodes) {
          const currentIndex = this.selectedAnime.episodes.findIndex(ep => ep.id === episode.id);
          this.prevEpisode = currentIndex > 0 ? this.selectedAnime.episodes[currentIndex - 1] : null;
          this.nextEpisode = currentIndex < this.selectedAnime.episodes.length - 1 
            ? this.selectedAnime.episodes[currentIndex + 1] 
            : null;
        }
        
        this.showPlayer = true;
      } catch (error) {
        console.error("Error playing episode:", error);
        alert("Erro ao carregar o episódio. Tente novamente.");
      } finally {
        this.isLoading = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.selectedAnime = {};
    },

    closePlayer() {
      this.showPlayer = false;
      this.currentEpisode = {};
      this.videoUrl = "";
      this.prevEpisode = null;
      this.nextEpisode = null;
    }
  }
}).mount('#app');