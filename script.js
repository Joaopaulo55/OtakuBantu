// Configuração da API
const API_BASE_URL = 'https://otakubantubackend.onrender.com';

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const searchToggle = document.getElementById('search-toggle');
const searchBar = document.getElementById('search-bar');
const navLinks = document.querySelectorAll('.nav-link');
const genreTags = document.querySelectorAll('.genre-tag');
const animeModal = document.getElementById('anime-modal');
const modalClose = document.querySelector('.modal-close');
const cursor = document.querySelector('.custom-cursor');
const preloader = document.querySelector('.preloader');

// Current Theme
let currentTheme = localStorage.getItem('theme') || 'dark';

// Initialize
function init() {
    // Set theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Set cursor
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    
    // Highlight active nav link based on scroll position
    window.addEventListener('scroll', highlightNavLink);
    
    // Load data
    loadPopularAnime();
    loadRecommendedAnime();
    loadAnimeNews();
    loadUpcomingAnime();
    
    // Remove preloader when everything is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            
            // Animate elements on scroll
            animateOnScroll();
        }, 1000);
    });
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
});

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('active');
});

// Search Toggle
searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('search-input').focus();
    }
});

// Close modal
modalClose.addEventListener('click', () => {
    animeModal.classList.remove('active');
});

// Custom Cursor
function moveCursor(e) {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // Add active class when hovering clickable elements
    const target = e.target;
    if (target.closest('button, a, [data-modal]')) {
        cursor.classList.add('active');
    } else {
        cursor.classList.remove('active');
    }
}

// Highlight active nav link
function highlightNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (
            section.offsetTop <= scrollPosition &&
            section.offsetTop + section.offsetHeight > scrollPosition
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenuToggle.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                document.querySelector('.nav-links').classList.remove('active');
            }
        });
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

// API Functions
async function loadPopularAnime() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/populares`);
        const data = await response.json();
        
        const popularContainer = document.getElementById('popular-anime');
        popularContainer.innerHTML = '';
        
        data.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card hover-grow';
            animeCard.innerHTML = `
                <div class="anime-poster">
                    <img src="${anime.imagem}" alt="${anime.titulo}">
                </div>
                <div class="anime-info">
                    <h3 class="anime-title">${anime.titulo}</h3>
                    <div class="anime-meta">
                        <span>${anime.tipo}</span>
                        <span>${anime.episódios || '?'} eps</span>
                    </div>
                    <p class="anime-synopsis">${anime.sinopse}</p>
                </div>
            `;
            
            animeCard.addEventListener('click', () => openAnimeModal(anime));
            popularContainer.appendChild(animeCard);
        });
    } catch (error) {
        console.error('Error loading popular anime:', error);
    }
}

async function loadRecommendedAnime() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recomendados`);
        const data = await response.json();
        
        const recommendedContainer = document.getElementById('recommended-anime');
        const recommendedTitle = document.getElementById('recommended-title');
        
        recommendedTitle.textContent = data.foco;
        recommendedContainer.innerHTML = '';
        
        data.recomendados.forEach(anime => {
            const animeItem = document.createElement('div');
            animeItem.className = 'anime-list-item hover-grow';
            animeItem.innerHTML = `
                <div class="anime-list-poster">
                    <img src="${anime.imagem}" alt="${anime.titulo}">
                </div>
                <div class="anime-list-info">
                    <h3 class="anime-list-title">${anime.titulo}</h3>
                    <p class="anime-list-synopsis">${anime.sinopse}</p>
                    <div class="anime-list-meta">
                        <span>${anime.status}</span>
                    </div>
                </div>
            `;
            
            animeItem.addEventListener('click', () => openAnimeModal(anime));
            recommendedContainer.appendChild(animeItem);
        });
    } catch (error) {
        console.error('Error loading recommended anime:', error);
    }
}

async function loadAnimeNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/noticias`);
        const data = await response.json();
        
        const newsContainer = document.getElementById('anime-news');
        newsContainer.innerHTML = '';
        
        data.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card hover-grow';
            newsCard.innerHTML = `
                <div class="news-content">
                    <h3 class="news-title">${news.titulo}</h3>
                    <p class="news-summary">${news.resumo || 'Sem resumo disponível.'}</p>
                    <a href="${news.link}" target="_blank" rel="noopener" class="news-link">
                        Ler notícia <i class="icon-external"></i>
                    </a>
                </div>
            `;
            newsContainer.appendChild(newsCard);
        });
    } catch (error) {
        console.error('Error loading anime news:', error);
    }
}

async function loadUpcomingAnime() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lancamentos`);
        const data = await response.json();
        
        const upcomingContainer = document.getElementById('upcoming-anime');
        upcomingContainer.innerHTML = '';
        
        data.forEach(anime => {
            const releaseDate = new Date(anime.estreia);
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            
            const upcomingItem = document.createElement('div');
            upcomingItem.className = 'upcoming-item hover-grow';
            upcomingItem.innerHTML = `
                <div class="upcoming-date">
                    <span class="upcoming-day">${releaseDate.getDate()}</span>
                    <span class="upcoming-month">${monthNames[releaseDate.getMonth()]}</span>
                </div>
                <div class="upcoming-info">
                    <h3 class="upcoming-title">${anime.titulo}</h3>
                    <p class="upcoming-synopsis">${anime.sinopse}</p>
                </div>
                <div class="upcoming-poster">
                    <img src="${anime.imagem}" alt="${anime.titulo}">
                </div>
            `;
            
            upcomingItem.addEventListener('click', () => openAnimeModal(anime));
            upcomingContainer.appendChild(upcomingItem);
        });
    } catch (error) {
        console.error('Error loading upcoming anime:', error);
    }
}

// Open Anime Modal
function openAnimeModal(anime) {
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalType = document.getElementById('modal-type');
    const modalEpisodes = document.getElementById('modal-episodes');
    const modalStatus = document.getElementById('modal-status');
    const modalSynopsis = document.getElementById('modal-synopsis');
    
    modalTitle.textContent = anime.titulo;
    modalImage.src = anime.imagem;
    modalImage.alt = anime.titulo;
    modalType.textContent = anime.tipo || 'Tipo desconhecido';
    modalEpisodes.textContent = anime.episódios ? `${anime.episódios} episódios` : 'Episódios desconhecidos';
    modalStatus.textContent = anime.status || 'Status desconhecido';
    modalSynopsis.textContent = anime.sinopse || 'Sinopse não disponível.';
    
    animeModal.classList.add('active');
}

// Filter by genre
genreTags.forEach(tag => {
    tag.addEventListener('click', async () => {
        genreTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        const genre = tag.dataset.genre;
        try {
            const response = await fetch(`${API_BASE_URL}/api/recomendados?genero=${genre}`);
            const data = await response.json();
            
            const recommendedContainer = document.getElementById('recommended-anime');
            recommendedContainer.innerHTML = '';
            
            data.recomendados.forEach(anime => {
                const animeItem = document.createElement('div');
                animeItem.className = 'anime-list-item hover-grow';
                animeItem.innerHTML = `
                    <div class="anime-list-poster">
                        <img src="${anime.imagem}" alt="${anime.titulo}">
                    </div>
                    <div class="anime-list-info">
                        <h3 class="anime-list-title">${anime.titulo}</h3>
                        <p class="anime-list-synopsis">${anime.sinopse}</p>
                        <div class="anime-list-meta">
                            <span>${anime.status}</span>
                        </div>
                    </div>
                `;
                
                animeItem.addEventListener('click', () => openAnimeModal(anime));
                recommendedContainer.appendChild(animeItem);
            });
        } catch (error) {
            console.error('Error filtering by genre:', error);
        }
    });
});

// Initialize the app
document.addEventListener('DOMContentLoaded', init);