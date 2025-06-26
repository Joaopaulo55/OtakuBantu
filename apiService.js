// apiService.js

const API_BASE = 'https://consumet-api-fawn.vercel.app/anime/gogoanime'; // Altere se estiver em localhost ou domínio próprio

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


