// Utility functions

// Debounce function to limit how often a function is called
function debounce(func, wait = 100, immediate = false) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Truncate text with ellipsis
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add event listener with debounce
function onDebouncedEvent(element, event, callback, delay = 100) {
    const debouncedCallback = debounce(callback, delay);
    element.addEventListener(event, debouncedCallback);
}

// Export utility functions
export {
    debounce,
    formatDate,
    truncateText,
    isInViewport,
    onDebouncedEvent
};