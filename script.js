

// apiService.js

const API_BASE = 'https://otakubantubackend.onrender.com'; // Altere se estiver em localhost ou domínio próprio

const apiService = {
  // Buscar animes por nome (com suporte à paginação)
  searchAnimes: (query, page = 1) =>
    fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&page=${page}`)
      .then(res => res.json()),

  // Buscar animes populares
  getPopularAnimes: () =>
    fetch(`${API_BASE}/popular`)
      .then(res => res.json()),

  // Buscar últimos episódios lançados
  getRecentEpisodes: () =>
    fetch(`${API_BASE}/recent`)
      .then(res => res.json()),

  // Buscar detalhes completos de um anime
  getAnimeDetails: (id) =>
    fetch(`${API_BASE}/anime/${id}`)
      .then(res => res.json()),

  // Buscar fontes de vídeo de um episódio
  getEpisodeVideo: (episodeId) =>
    fetch(`${API_BASE}/watch/${episodeId}`)
      .then(res => res.json()),

  // Buscar animes por gênero (filtro local)
  getAnimesByGenre: (genre, page = 1) =>
    fetch(`${API_BASE}/genre/${genre}?page=${page}`)
      .then(res => res.json()),

  // Assinar newsletter (caso adicione essa rota futuramente no backend)
  subscribeNewsletter: (email) =>
    fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(res => res.json())
};

export default apiService; // se usar módulos ES




// Main Vue App
const { createApp } = Vue;

createApp({
    data() {
        return {
            // App State
            mobileMenuOpen: false,
            modalOpen: false,
            modalType: '',
            modalTitle: '',
            loading: false,
            currentSlide: 0,
            searchQuery: '',
            newsletterEmail: '',
            
            // Data that will come from API
            heroSlides: [],
            latestEpisodes: [],
            popularAnimes: [],
            genres: [
                { name: 'Ação', icon: 'images/genres/action.png', count: '1250' },
                { name: 'Aventura', icon: 'images/genres/adventure.png', count: '876' },
                { name: 'Comédia', icon: 'images/genres/comedy.png', count: '954' },
                { name: 'Drama', icon: 'images/genres/drama.png', count: '732' },
                { name: 'Fantasia', icon: 'images/genres/fantasy.png', count: '689' },
                { name: 'Horror', icon: 'images/genres/horror.png', count: '432' },
                { name: 'Mistério', icon: 'images/genres/mystery.png', count: '321' },
                { name: 'Romance', icon: 'images/genres/romance.png', count: '567' },
                { name: 'Sci-Fi', icon: 'images/genres/scifi.png', count: '498' },
                { name: 'Slice of Life', icon: 'images/genres/sliceoflife.png', count: '456' },
                { name: 'Esportes', icon: 'images/genres/sports.png', count: '234' },
                { name: 'Sobrenatural', icon: 'images/genres/supernatural.png', count: '543' }
            ],
            
            searchResults: [],
            selectedAnime: {}
        }
    },
    
    async mounted() {
        this.loading = true;
        
        try {
            // Fetch initial data
            await this.fetchHeroSlides();
            await this.fetchLatestEpisodes();
            await this.fetchPopularAnimes();
            
            // Initialize slider
            this.startSlider();
            
            // Add scroll event for header
            window.addEventListener('scroll', this.handleScroll);
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Ocorreu um erro ao carregar os dados. Por favor, recarregue a página.');
        } finally {
            this.loading = false;
        }
    },
    
    methods: {
        // Toggle mobile menu
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
        },
        
        // Open modal
        openModal(type, title, anime = null) {
            this.modalType = type;
            this.modalTitle = title;
            this.modalOpen = true;
            
            if (type === 'anime' && anime) {
                this.selectedAnime = anime;
            }
            
            document.body.style.overflow = 'hidden';
        },
        
        // Close modal
        closeModal() {
            this.modalOpen = false;
            this.modalType = '';
            this.modalTitle = '';
            document.body.style.overflow = 'auto';
        },
        
        // Handle scroll for header
        handleScroll() {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        },
        
        // Search anime
        async searchAnime() {
            if (this.searchQuery.trim() === '') return;
            
            this.loading = true;
            
            try {
                const results = await apiService.searchAnimes(this.searchQuery);
                this.searchResults = results.results || [];
                this.openModal('search', `Resultados para: ${this.searchQuery}`);
            } catch (error) {
                console.error('Search error:', error);
                alert('Ocorreu um erro ao buscar animes. Por favor, tente novamente.');
            } finally {
                this.loading = false;
            }
        },
        
        // Subscribe to newsletter
        async subscribeNewsletter() {
            if (!this.newsletterEmail) return;
            
            this.loading = true;
            
            try {
                await apiService.subscribeNewsletter(this.newsletterEmail);
                alert(`Obrigado por assinar nossa newsletter! Um e-mail foi enviado para ${this.newsletterEmail}`);
                this.newsletterEmail = '';
            } catch (error) {
                console.error('Newsletter error:', error);
                alert('Ocorreu um erro ao assinar a newsletter. Por favor, tente novamente.');
            } finally {
                this.loading = false;
            }
        },
        
        // Fetch hero slides
        async fetchHeroSlides() {
            try {
                const { results } = await apiService.getPopularAnimes();
                this.heroSlides = results.slice(0, 3).map(anime => ({
                    title: anime.title,
                    description: anime.description || 'Descrição não disponível',
                    year: anime.releaseDate || 'N/A',
                    rating: anime.rating || '8.0',
                    episodes: anime.totalEpisodes || 'N/A',
                    image: anime.image
                }));
            } catch (error) {
                console.error('Error fetching hero slides:', error);
                // Fallback data
                this.heroSlides = [
                    {
                        title: 'Demon Slayer: Kimetsu no Yaiba',
                        description: 'Tanjiro Kamado, um jovem bondoso que ganha a vida vendendo carvão, descobre que sua família foi massacrada por um demônio.',
                        year: '2019',
                        rating: '8.7',
                        episodes: '26',
                        image: 'https://via.placeholder.com/800x450/ff5e57/ffffff?text=Demon+Slayer'
                    },
                    {
                        title: 'Attack on Titan',
                        description: 'Eren Yeager vive em um mundo onde a humanidade está à beira da extinção devido aos Titãs, criaturas gigantes que devoram humanos.',
                        year: '2013',
                        rating: '9.0',
                        episodes: '75+',
                        image: 'https://via.placeholder.com/800x450/3d3d3d/ffffff?text=Attack+on+Titan'
                    },
                    {
                        title: 'Jujutsu Kaisen',
                        description: 'Yuji Itadori engole um objeto amaldiçoado e se torna o hospedeiro de uma poderosa maldição, entrando no mundo dos feiticeiros jujutsu.',
                        year: '2020',
                        rating: '8.8',
                        episodes: '24',
                        image: 'https://via.placeholder.com/800x450/1e1e1e/ffffff?text=Jujutsu+Kaisen'
                    }
                ];
            }
        },
        
        // Fetch latest episodes
        async fetchLatestEpisodes() {
            try {
                const { results } = await apiService.getRecentEpisodes();
                this.latestEpisodes = results.slice(0, 8).map(episode => ({
                    title: episode.title,
                    thumbnail: episode.image,
                    episodeNumber: episode.episodeNumber,
                    time: '24 min',
                    date: 'Hoje',
                    id: episode.id
                }));
            } catch (error) {
                console.error('Error fetching latest episodes:', error);
                // Fallback data
                this.latestEpisodes = [
                    {
                        title: 'Demon Slayer: Kimetsu no Yaiba',
                        thumbnail: 'https://via.placeholder.com/300x169/ff5e57/ffffff?text=Demon+Slayer',
                        episodeNumber: '26',
                        time: '24 min',
                        date: 'Hoje'
                    },
                    {
                        title: 'Attack on Titan Final Season',
                        thumbnail: 'https://via.placeholder.com/300x169/3d3d3d/ffffff?text=Attack+on+Titan',
                        episodeNumber: '12',
                        time: '23 min',
                        date: 'Hoje'
                    },
                    {
                        title: 'Jujutsu Kaisen',
                        thumbnail: 'https://via.placeholder.com/300x169/1e1e1e/ffffff?text=Jujutsu+Kaisen',
                        episodeNumber: '24',
                        time: '24 min',
                        date: 'Ontem'
                    }
                ];
            }
        },
        
        // Fetch popular animes
        async fetchPopularAnimes() {
            try {
                const { results } = await apiService.getPopularAnimes();
                this.popularAnimes = results.slice(0, 8).map(anime => ({
                    title: anime.title,
                    thumbnail: anime.image,
                    year: anime.releaseDate || 'N/A',
                    type: anime.type || 'TV',
                    rating: anime.rating || '8.0',
                    id: anime.id
                }));
            } catch (error) {
                console.error('Error fetching popular animes:', error);
                // Fallback data
                this.popularAnimes = [
                    {
                        title: 'Demon Slayer: Kimetsu no Yaiba',
                        thumbnail: 'https://via.placeholder.com/300x169/ff5e57/ffffff?text=Demon+Slayer',
                        year: '2019',
                        type: 'Série',
                        rating: '8.7'
                    },
                    {
                        title: 'Attack on Titan',
                        thumbnail: 'https://via.placeholder.com/300x169/3d3d3d/ffffff?text=Attack+on+Titan',
                        year: '2013',
                        type: 'Série',
                        rating: '9.0'
                    }
                ];
            }
        },
        
        // Get anime details
        async getAnimeDetails(animeId) {
            this.loading = true;
            try {
                const details = await apiService.getAnimeDetails(animeId);
                this.selectedAnime = {
                    title: details.title,
                    thumbnail: details.image,
                    rating: details.rating || '8.0',
                    year: details.releaseDate || 'N/A',
                    episodes: details.episodes?.length || details.totalEpisodes || 'N/A',
                    genre: details.genres?.join(', ') || 'Ação, Aventura',
                    synopsis: details.description || 'Sinopse não disponível.',
                    id: details.id
                };
                this.openModal('anime', details.title, this.selectedAnime);
            } catch (error) {
                console.error('Error fetching anime details:', error);
                alert('Ocorreu um erro ao buscar detalhes do anime. Por favor, tente novamente.');
            } finally {
                this.loading = false;
            }
        },
        
        // Get episode video
        async getEpisodeVideo(episodeId) {
            this.loading = true;
            try {
                const videoData = await apiService.getEpisodeVideo(episodeId);
                if (videoData.sources && videoData.sources.length > 0) {
                    // Find the best quality source
                    const bestSource = videoData.sources.reduce((prev, current) => 
                        (prev.quality > current.quality) ? prev : current
                    );
                    
                    // Open in new tab
                    window.open(bestSource.url, '_blank');
                    
                    // Alternatively, you could implement an embedded player here
                } else {
                    throw new Error('Nenhuma fonte de vídeo disponível');
                }
            } catch (error) {
                console.error('Error fetching episode video:', error);
                alert('Ocorreu um erro ao carregar o episódio. Por favor, tente novamente.');
            } finally {
                this.loading = false;
            }
        },
        
        // Download episode
        async downloadEpisode(episodeId, episodeTitle) {
            try {
                const videoData = await apiService.getEpisodeVideo(episodeId);
                if (videoData.sources && videoData.sources.length > 0) {
                    const source = videoData.sources.find(s => s.quality === '720p') || videoData.sources[0];
                    const a = document.createElement('a');
                    a.href = source.url;
                    a.download = `${episodeTitle.replace(/[^a-z0-9]/gi, '_')}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    throw new Error('Nenhuma fonte de vídeo disponível para download');
                }
            } catch (error) {
                console.error('Download error:', error);
                alert('Erro ao iniciar download. Por favor, tente assistir online.');
            }
        },
        
        // Slider functions
        startSlider() {
            setInterval(() => {
                this.nextSlide();
            }, 5000);
        },
        
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
        },
        
        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
        },
        
        // View anime details
        viewAnimeDetails(anime) {
            this.getAnimeDetails(anime.id);
        }
    }
}).mount('#app');