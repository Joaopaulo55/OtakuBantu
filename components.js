// Custom Components - In a real app, these would be Vue components

// Anime Card Component
const AnimeCard = {
    props: {
        anime: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="anime-card">
            <div class="anime-thumbnail">
                <img :src="anime.thumbnail" :alt="anime.title">
                <div class="overlay">
                    <a href="#" class="play-btn"><i class="fas fa-play"></i></a>
                    <div class="anime-rating"><i class="fas fa-star"></i> {{ anime.rating }}</div>
                </div>
            </div>
            <div class="anime-info">
                <h3>{{ anime.title }}</h3>
                <div class="meta">
                    <span>{{ anime.year }}</span>
                    <span>{{ anime.type }}</span>
                </div>
            </div>
        </div>
    `
};

// Episode Card Component
const EpisodeCard = {
    props: {
        episode: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="episode-card">
            <div class="episode-thumbnail">
                <img :src="episode.thumbnail" :alt="episode.title">
                <div class="episode-number">Ep {{ episode.episodeNumber }}</div>
                <div class="overlay">
                    <a href="#" class="play-btn"><i class="fas fa-play"></i></a>
                </div>
            </div>
            <div class="episode-info">
                <h3>{{ episode.title }}</h3>
                <div class="meta">
                    <span><i class="fas fa-clock"></i> {{ episode.time }}</span>
                    <span><i class="fas fa-calendar-alt"></i> {{ episode.date }}</span>
                </div>
            </div>
        </div>
    `
};

// Genre Card Component
const GenreCard = {
    props: {
        genre: {
            type: Object,
            required: true
        }
    },
    template: `
        <a href="#" class="genre-card">
            <div class="genre-icon">
                <i :class="genre.icon"></i>
            </div>
            <h3>{{ genre.name }}</h3>
            <p>{{ genre.count }} animes</p>
        </a>
    `
};

// Export components
export { AnimeCard, EpisodeCard, GenreCard };

