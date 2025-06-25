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
                this.searchResults = results;
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
                // In a real app, this would come from your API
                // For now, we'll use the sample data
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
            } catch (error) {
                console.error('Error fetching hero slides:', error);
                throw error;
            }
        },
        
        // Fetch latest episodes
        async fetchLatestEpisodes() {
            try {
                // In a real app, this would come from your API
                // For now, we'll use the sample data
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
                    },
                    {
                        title: 'My Hero Academia Season 6',
                        thumbnail: 'https://via.placeholder.com/300x169/2196F3/ffffff?text=My+Hero+Academia',
                        episodeNumber: '18',
                        time: '23 min',
                        date: 'Ontem'
                    },
                    {
                        title: 'Chainsaw Man',
                        thumbnail: 'https://via.placeholder.com/300x169/F44336/ffffff?text=Chainsaw+Man',
                        episodeNumber: '12',
                        time: '24 min',
                        date: '2 dias atrás'
                    },
                    {
                        title: 'Spy x Family',
                        thumbnail: 'https://via.placeholder.com/300x169/4CAF50/ffffff?text=Spy+x+Family',
                        episodeNumber: '25',
                        time: '24 min',
                        date: '2 dias atrás'
                    },
                    {
                        title: 'Vinland Saga Season 2',
                        thumbnail: 'https://via.placeholder.com/300x169/FFC107/333333?text=Vinland+Saga',
                        episodeNumber: '10',
                        time: '24 min',
                        date: '3 dias atrás'
                    },
                    {
                        title: 'Blue Lock',
                        thumbnail: 'https://via.placeholder.com/300x169/2196F3/ffffff?text=Blue+Lock',
                        episodeNumber: '22',
                        time: '23 min',
                        date: '3 dias atrás'
                    }
                ];
            } catch (error) {
                console.error('Error fetching latest episodes:', error);
                throw error;
            }
        },
        
        // Fetch popular animes
        async fetchPopularAnimes() {
            try {
                // In a real app, this would come from your API
                // For now, we'll use the sample data
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
                    },
                    {
                        title: 'Jujutsu Kaisen',
                        thumbnail: 'https://via.placeholder.com/300x169/1e1e1e/ffffff?text=Jujutsu+Kaisen',
                        year: '2020',
                        type: 'Série',
                        rating: '8.8'
                    },
                    {
                        title: 'My Hero Academia',
                        thumbnail: 'https://via.placeholder.com/300x169/2196F3/ffffff?text=My+Hero+Academia',
                        year: '2016',
                        type: 'Série',
                        rating: '8.4'
                    },
                    {
                        title: 'Chainsaw Man',
                        thumbnail: 'https://via.placeholder.com/300x169/F44336/ffffff?text=Chainsaw+Man',
                        year: '2022',
                        type: 'Série',
                        rating: '8.9'
                    },
                    {
                        title: 'Spy x Family',
                        thumbnail: 'https://via.placeholder.com/300x169/4CAF50/ffffff?text=Spy+x+Family',
                        year: '2022',
                        type: 'Série',
                        rating: '8.6'
                    },
                    {
                        title: 'Vinland Saga',
                        thumbnail: 'https://via.placeholder.com/300x169/FFC107/333333?text=Vinland+Saga',
                        year: '2019',
                        type: 'Série',
                        rating: '8.7'
                    },
                    {
                        title: 'Blue Lock',
                        thumbnail: 'https://via.placeholder.com/300x169/2196F3/ffffff?text=Blue+Lock',
                        year: '2022',
                        type: 'Série',
                        rating: '8.5'
                    }
                ];
            } catch (error) {
                console.error('Error fetching popular animes:', error);
                throw error;
            }
        },
        
        // Get anime details
        async getAnimeDetails(animeId) {
            this.loading = true;
            try {
                const details = await apiService.getAnimeDetails(animeId);
                this.selectedAnime = details;
                this.openModal('anime', details.animeTitle, details);
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
                // In a real app, you would handle the video data here
                console.log('Video data:', videoData);
                alert('Redirecionando para o player de vídeo...');
            } catch (error) {
                console.error('Error fetching episode video:', error);
                alert('Ocorreu um erro ao carregar o episódio. Por favor, tente novamente.');
            } finally {
                this.loading = false;
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
            // In a real app, you would use the anime ID to fetch details
            // For now, we'll just use the sample data
            this.selectedAnime = {
                ...anime,
                synopsis: 'Esta é uma sinopse de exemplo para o anime. Em uma aplicação real, isso viria da API.',
                genre: anime.type || 'Ação, Aventura'
            };
            this.openModal('anime', anime.title, this.selectedAnime);
        }
    }
}).mount('#app');