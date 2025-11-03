// BJJ Foundation - Main Application
class BJJFoundation {
    constructor() {
        this.videos = [];
        this.filteredVideos = [];
        this.filters = {
            guard: '',
            technique: '',
            position: '',
            submission: ''
        };
        this.searchQuery = '';
        
        this.init();
    }

    async init() {
        try {
            await this.loadVideos();
            this.populateFilters();
            this.setupEventListeners();
            this.applyFilters();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to load videos. Please check if bjj_simple_processed.json exists.');
        }
    }

    async loadVideos() {
        try {
            const response = await fetch('bjj_simple_processed.json');
            if (!response.ok) {
                throw new Error('Failed to load videos');
            }
            this.videos = await response.json();
            console.log(`Loaded ${this.videos.length} videos`);
        } catch (error) {
            console.error('Error loading videos:', error);
            throw error;
        }
    }

    populateFilters() {
        // Collect all unique values from classifications
        const guards = new Set();
        const positions = new Set();
        const submissions = new Set();

        this.videos.forEach(video => {
            if (video.classification) {
                // Guard types
                if (video.classification.guard_type) {
                    video.classification.guard_type.forEach(guard => guards.add(guard));
                }
                // Positions
                if (video.classification.position) {
                    video.classification.position.forEach(pos => positions.add(pos));
                }
                // Submissions
                if (video.classification.submission) {
                    video.classification.submission.forEach(sub => submissions.add(sub));
                }
            }
        });

        // Populate guard filter
        const guardFilter = document.getElementById('guard-filter');
        Array.from(guards).sort().forEach(guard => {
            const option = document.createElement('option');
            option.value = guard.toLowerCase();
            option.textContent = guard;
            guardFilter.appendChild(option);
        });

        // Populate position filter
        const positionFilter = document.getElementById('position-filter');
        Array.from(positions).sort().forEach(position => {
            const option = document.createElement('option');
            option.value = position.toLowerCase();
            option.textContent = position;
            positionFilter.appendChild(option);
        });

        // Populate submission filter
        const submissionFilter = document.getElementById('submission-filter');
        Array.from(submissions).sort().forEach(submission => {
            const option = document.createElement('option');
            option.value = submission.toLowerCase();
            option.textContent = submission;
            submissionFilter.appendChild(option);
        });
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            clearSearch.style.display = this.searchQuery ? 'flex' : 'none';
            this.applyFilters();
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            clearSearch.style.display = 'none';
            this.applyFilters();
            searchInput.focus();
        });

        // Filter change events
        document.getElementById('guard-filter').addEventListener('change', (e) => {
            this.filters.guard = e.target.value;
            this.applyFilters();
        });

        document.getElementById('technique-filter').addEventListener('change', (e) => {
            this.filters.technique = e.target.value;
            this.applyFilters();
        });

        document.getElementById('position-filter').addEventListener('change', (e) => {
            this.filters.position = e.target.value;
            this.applyFilters();
        });

        document.getElementById('submission-filter').addEventListener('change', (e) => {
            this.filters.submission = e.target.value;
            this.applyFilters();
        });

        // Reset button
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
    }

    applyFilters() {
        this.filteredVideos = this.videos.filter(video => {
            // Search filter
            if (this.searchQuery) {
                const searchText = [
                    video.title || '',
                    video.description || '',
                    ...(video.tags || [])
                ].join(' ').toLowerCase();

                if (!searchText.includes(this.searchQuery)) {
                    return false;
                }
            }

            if (!video.classification) return false;

            // Guard filter
            if (this.filters.guard) {
                const hasGuard = video.classification.guard_type?.some(
                    guard => guard.toLowerCase() === this.filters.guard
                );
                if (!hasGuard) return false;
            }

            // Technique filter
            if (this.filters.technique) {
                const hasTechnique = video.classification[this.filters.technique]?.length > 0;
                if (!hasTechnique) return false;
            }

            // Position filter
            if (this.filters.position) {
                const hasPosition = video.classification.position?.some(
                    pos => pos.toLowerCase() === this.filters.position
                );
                if (!hasPosition) return false;
            }

            // Submission filter
            if (this.filters.submission) {
                const hasSubmission = video.classification.submission?.some(
                    sub => sub.toLowerCase() === this.filters.submission
                );
                if (!hasSubmission) return false;
            }

            return true;
        });

        this.renderVideos();
        this.updateResultsCount();
    }

    renderVideos() {
        const grid = document.getElementById('videos-grid');
        const loading = document.getElementById('loading');
        const noResults = document.getElementById('no-results');

        // Hide loading
        loading.style.display = 'none';

        // Clear grid
        grid.innerHTML = '';

        // Check if no results
        if (this.filteredVideos.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        // Render video cards
        this.filteredVideos.forEach(video => {
            const card = this.createVideoCard(video);
            grid.appendChild(card);
        });
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';

        // Extract video ID from YouTube link
        const videoId = this.extractVideoId(video.youtube_link);
        const thumbnailUrl = videoId 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : 'https://via.placeholder.com/480x360?text=No+Thumbnail';

        // Create tags HTML
        const tagsHTML = this.createTagsHTML(video.classification);

        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${thumbnailUrl}" alt="${this.escapeHtml(video.title)}" 
                     onerror="this.src='https://via.placeholder.com/480x360?text=No+Thumbnail'">
                <div class="play-overlay"></div>
            </div>
            <div class="video-content">
                <h3 class="video-title">${this.escapeHtml(video.title)}</h3>
                ${video.view_count ? `<div class="video-views">👁️ ${this.formatViews(video.view_count)} views</div>` : ''}
                <div class="video-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;

        // Add click event to open YouTube video
        card.addEventListener('click', () => {
            window.open(video.youtube_link, '_blank');
        });

        return card;
    }

    createTagsHTML(classification) {
        if (!classification) return '';

        const tags = [];

        // Add guard tags
        if (classification.guard_type) {
            classification.guard_type.forEach(guard => {
                tags.push(`<span class="tag guard">🛡️ ${this.escapeHtml(guard)}</span>`);
            });
        }

        // Add position tags
        if (classification.position) {
            classification.position.forEach(pos => {
                tags.push(`<span class="tag">📍 ${this.escapeHtml(pos)}</span>`);
            });
        }

        // Add pass tags
        if (classification.pass) {
            classification.pass.forEach(pass => {
                tags.push(`<span class="tag pass">⚔️ ${this.escapeHtml(pass)}</span>`);
            });
        }

        // Add sweep tags
        if (classification.sweep) {
            classification.sweep.forEach(sweep => {
                tags.push(`<span class="tag sweep">🌀 ${this.escapeHtml(sweep)}</span>`);
            });
        }

        // Add submission tags
        if (classification.submission) {
            classification.submission.forEach(sub => {
                tags.push(`<span class="tag submission">🎯 ${this.escapeHtml(sub)}</span>`);
            });
        }

        // Add other technique tags (limit to 3)
        if (classification.technique) {
            classification.technique.slice(0, 3).forEach(tech => {
                tags.push(`<span class="tag">⚡ ${this.escapeHtml(tech)}</span>`);
            });
        }

        return tags.join('');
    }

    extractVideoId(url) {
        if (!url) return null;
        
        // Handle different YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toLocaleString();
    }

    updateResultsCount() {
        const count = document.getElementById('results-count');
        const total = this.videos.length;
        const filtered = this.filteredVideos.length;

        if (filtered === total) {
            count.textContent = `Showing all ${total} techniques`;
        } else {
            count.textContent = `Showing ${filtered} of ${total} techniques`;
        }
    }

    resetFilters() {
        // Reset filter object
        this.filters = {
            guard: '',
            technique: '',
            position: '',
            submission: ''
        };

        // Reset search
        this.searchQuery = '';
        document.getElementById('search-input').value = '';
        document.getElementById('clear-search').style.display = 'none';

        // Reset select elements
        document.getElementById('guard-filter').value = '';
        document.getElementById('technique-filter').value = '';
        document.getElementById('position-filter').value = '';
        document.getElementById('submission-filter').value = '';

        // Reapply filters (will show all)
        this.applyFilters();
    }

    showError(message) {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div style="color: var(--danger-red); text-align: center;">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Scroll header functionality
function initScrollHeader() {
    const header = document.querySelector('.header');
    const heroHeight = document.querySelector('.hero-banner')?.offsetHeight || 0;

    window.addEventListener('scroll', () => {
        if (window.scrollY > heroHeight - 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BJJFoundation();
    initScrollHeader();
});
