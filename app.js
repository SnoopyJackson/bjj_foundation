// BJJ Foundation - Main Application
class BJJFoundation {
    constructor() {
        // Limit number of cards rendered by default for speed
        // Detect mobile devices and reduce card limit significantly
        this.isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.DEFAULT_MAX_CARDS = this.isMobile ? 50 : 200; // Mobile: 50 cards, Desktop: 200 cards
        this.videos = [];
        this.fightVideos = [];
        this.allVideos = []; // Combined array of technique and fight videos
        this.filteredVideos = [];
        this.filters = {
            techniqueCategory: '', // High-level filter: pass, sweep, submission, takedown, technique
            guard: '',
            pass: '',
            sweep: '',
            position: '',
            submission: '',
            takedown: '',
            channel: '',
            athlete: '' // Fight athlete filter
        };
        this.searchQuery = '';
        this.searchDebounceTimer = null; // Debounce timer for search input
        
        // Top BJJ athletes for filtering
        this.TOP_ATHLETES = [
            'Gordon Ryan',
            'Mikey Musumeci',
            'Tye Ruotolo',
            'Kade Ruotolo',
            'Nicholas Meregali',
            'Felipe Pena',
            'Lachlan Giles',
            'Craig Jones',
            'Kaynan Duarte',
            'Mica Galvao',
            'Marcus Almeida',
            'Leandro Lo',
            'Andre Galvao',
            'Roger Gracie',
            'Marcelo Garcia',
            'Rafael Mendes',
            'Gui Mendes',
            'Cobrinha',
            'Lucas Lepri',
            'Rubens Charles',
            'Gilbert Burns',
            'Rodolfo Vieira',
            'Marcus Buchecha',
            'Joao Gabriel',
            'Gabriel Arges',
            'Tex Johnson',
            'Andrew Tackett',
            'Pedro Marinho',
            'Giancarlo Bodoni',
            'Dante Leon',
            'Jozef Chen',
            'Tommy Langaker',
            'Roberto Jimenez',
            'Erich Munis',
            'Jonatha Alves',
            'Fabricio Werdum',
            'Erberth Santos',
            'Gabriel Sousa',
            'Isaac Doederlein',
            'Ffion Davies',
            'Mayssa Bastos',
            'Bia Mesquita',
            'Mackenzie Dern',
            'Beatriz Mesquita',
            'Ana Carolina Vieira',
            'Nathiely Jesus',
            'Gabi Garcia',
            'Thamara Ferreira',
            'Amanda Monteiro',
            'Luiza Monteiro',
            'Adam Wardzinski',
            'Nicky Rod',
            'Garry Tonon',
            'Nicky Ryan',
            'Tainan Dalpra',
            'Keenan Cornelius',
            'Rafa Lovato Jr.',
            'JT Torres',
            'Bruno Malfacine',
            'Mackenzie Dern',
            'Joao Miyao',
            'Paulo Miyao',
            'Diogo Reis',
            'Melqui Galvao',
            'Cole Abate',
            'Ryan Hall',
            'Geo Martinez',
            'Eddie Cummings',
            'Diego Pato', 
            'Ethan Crelinsten', 
            'Helena Crevar', 
            'Sarah Galvão'
                        
        ];
        
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
            // Load technique videos
            const techResponse = await fetch('bjj_simple_processed.json');
            if (!techResponse.ok) {
                throw new Error('Failed to load technique videos');
            }
            this.videos = await techResponse.json();
            console.log(`Loaded ${this.videos.length} technique videos`);

            // Load fight videos
            try {
                const fightResponse = await fetch('fight_simple.json');
                if (fightResponse.ok) {
                    this.fightVideos = await fightResponse.json();
                    // Mark fight videos with a type flag
                    this.fightVideos.forEach(video => {
                        video.isFight = true;
                    });
                    console.log(`Loaded ${this.fightVideos.length} fight videos`);
                }
            } catch (fightError) {
                console.warn('Fight videos not available:', fightError);
            }

            // Combine both datasets
            this.allVideos = [...this.videos, ...this.fightVideos];
            console.log(`Total videos: ${this.allVideos.length}`);
        } catch (error) {
            console.error('Error loading videos:', error);
            throw error;
        }
    }

    populateFilters() {
        // Collect counts for each classification so we can rank options by popularity
        const guardCounts = new Map();
        const passCounts = new Map();
        const sweepCounts = new Map();
        const positionCounts = new Map();
        const submissionCounts = new Map();
        const takedownCounts = new Map();
        const escapeCounts = new Map();
        const channelCounts = new Map();

        // Helper to increment map counts
        const inc = (map, key) => {
            if (!key) return;
            const k = String(key).trim();
            if (!k) return;
            map.set(k, (map.get(k) || 0) + 1);
        };

        // Process all videos (techniques + fights)
        this.allVideos.forEach(video => {
            if (video.classification) {
                if (video.classification.guard_type) {
                    video.classification.guard_type.forEach(g => inc(guardCounts, g));
                }
                if (video.classification.pass) {
                    video.classification.pass.forEach(p => inc(passCounts, p));
                }
                if (video.classification.sweep) {
                    video.classification.sweep.forEach(s => inc(sweepCounts, s));
                }
                if (video.classification.position) {
                    video.classification.position.forEach(pos => inc(positionCounts, pos));
                }
                if (video.classification.submission) {
                    video.classification.submission.forEach(sub => inc(submissionCounts, sub));
                }
                if (video.classification.takedown) {
                    video.classification.takedown.forEach(td => inc(takedownCounts, td));
                }
                if (video.classification.escape) {
                    video.classification.escape.forEach(es => inc(escapeCounts, es));
                }
            }

            if (video.channel_name) {
                inc(channelCounts, video.channel_name);
            }
        });

        // Utility to populate a select from a counts map, sorted by count desc
        const populateFromCounts = (selectId, countsMap, showCount = true) => {
            const sel = document.getElementById(selectId);
            if (!sel) return;
            // Remove existing options except the first (default) option
            while (sel.options.length > 1) sel.remove(1);

            const entries = Array.from(countsMap.entries()).sort((a, b) => b[1] - a[1]);
            entries.forEach(([name, cnt]) => {
                const option = document.createElement('option');
                option.value = name.toLowerCase();
                option.textContent = showCount ? `${name} (${cnt})` : name;
                sel.appendChild(option);
            });
        };

        // Populate filters ranked by number of videos (most -> least)
        populateFromCounts('guard-filter', guardCounts);
        populateFromCounts('pass-filter', passCounts);
        populateFromCounts('sweep-filter', sweepCounts);
        populateFromCounts('position-filter', positionCounts);
        populateFromCounts('submission-filter', submissionCounts);
        populateFromCounts('takedown-filter', takedownCounts);
        populateFromCounts('escape-filter', escapeCounts);
        populateFromCounts('channel-filter', channelCounts, true);

        // Populate athlete filter: only include TOP_ATHLETES but rank them by actual fight counts when possible
        const athleteFilter = document.getElementById('athlete-filter');
        if (athleteFilter) {
            // Build counts map from fight videos (this.fightVideos)
            const athleteCounts = new Map();
            const incAth = (name) => {
                if (!name) return;
                const n = String(name).trim();
                if (!n) return;
                athleteCounts.set(n, (athleteCounts.get(n) || 0) + 1);
            };

            if (Array.isArray(this.fightVideos) && this.fightVideos.length > 0) {
                this.fightVideos.forEach(v => {
                    if (!v.athletes) return;
                    if (Array.isArray(v.athletes)) {
                        v.athletes.forEach(a => incAth(a));
                    } else if (typeof v.athletes === 'string') {
                        incAth(v.athletes);
                    }
                });
            }

            // Remove existing options except the default
            while (athleteFilter.options.length > 1) athleteFilter.remove(1);

            // Build list of TOP_ATHLETES with their counts (0 if none)
            const topWithCounts = this.TOP_ATHLETES.map(name => {
                const cnt = athleteCounts.get(name) || 0;
                return { name, cnt };
            });

            // Sort TOP_ATHLETES by count desc; if counts are equal, keep the original order
            topWithCounts.sort((a, b) => b.cnt - a.cnt);

            topWithCounts.forEach(({ name, cnt }) => {
                const option = document.createElement('option');
                option.value = name.toLowerCase();
                option.textContent = cnt > 0 ? `${name} (${cnt})` : name;
                athleteFilter.appendChild(option);
            });
        }
    }

    setupEventListeners() {
        // Search input with debouncing
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            clearSearch.style.display = this.searchQuery ? 'flex' : 'none';
            
            // Debounce search - wait 300ms after user stops typing
            clearTimeout(this.searchDebounceTimer);
            this.searchDebounceTimer = setTimeout(() => {
                this.applyFilters();
            }, 300);
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            clearSearch.style.display = 'none';
            clearTimeout(this.searchDebounceTimer); // Clear any pending search
            this.applyFilters();
            searchInput.focus();
        });

        // Filter change events
        document.getElementById('technique-category-filter').addEventListener('change', (e) => {
            this.filters.techniqueCategory = e.target.value;
            this.applyFilters();
        });

        document.getElementById('guard-filter').addEventListener('change', (e) => {
            this.filters.guard = e.target.value;
            this.applyFilters();
        });

        document.getElementById('pass-filter').addEventListener('change', (e) => {
            this.filters.pass = e.target.value;
            this.applyFilters();
        });

        document.getElementById('sweep-filter').addEventListener('change', (e) => {
            this.filters.sweep = e.target.value;
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

        document.getElementById('takedown-filter').addEventListener('change', (e) => {
            this.filters.takedown = e.target.value;
            this.applyFilters();
        });

        // Escape filter
        const escapeSelect = document.getElementById('escape-filter');
        if (escapeSelect) {
            escapeSelect.addEventListener('change', (e) => {
                this.filters.escape = e.target.value;
                this.applyFilters();
            });
        }

        document.getElementById('channel-filter').addEventListener('change', (e) => {
            this.filters.channel = e.target.value;
            this.applyFilters();
        });

        // Athlete filter (for fight videos)
        const athleteFilter = document.getElementById('athlete-filter');
        if (athleteFilter) {
            athleteFilter.addEventListener('change', (e) => {
                this.filters.athlete = e.target.value;
                this.applyFilters();
            });
        }

        // Reset button
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
    }

    // Core filtering logic - returns matching videos using current filters + optional overrides
    _filterVideos(filterOverrides = {}) {
        const f = { ...this.filters, ...filterOverrides };

        return this.allVideos.filter(video => {
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

            // Channel filter (applies to both fight and technique videos)
            if (f.channel) {
                const hasChannel = video.channel_name?.toLowerCase() === f.channel;
                if (!hasChannel) return false;
            }

            // Check if any technique filters are active
            const hasTechniqueFilters = f.techniqueCategory || 
                f.guard || f.pass || f.sweep || 
                f.position || f.submission || f.takedown;
            
            // Check if athlete filter is active
            const hasAthleteFilter = f.athlete;

            // For fight videos (have athletes field)
            if (video.isFight) {
                // If technique filters are set, hide all fight videos
                if (hasTechniqueFilters) {
                    return false;
                }
                
                // If athlete filter is set, must match
                if (hasAthleteFilter) {
                    if (!video.athletes || !Array.isArray(video.athletes)) {
                        return false;
                    }
                    const hasAthlete = video.athletes.some(athlete => 
                        athlete.toLowerCase().includes(f.athlete)
                    );
                    return hasAthlete;
                }
                
                // No filters active - show fight video
                return true;
            }

            // For technique videos (no athletes field)
            // If athlete filter is set, hide all technique videos
            if (hasAthleteFilter) {
                return false;
            }
            
            // Must have classification
            if (!video.classification) return false;

            // Technique Category filter (high-level)
            if (f.techniqueCategory) {
                if (f.techniqueCategory === 'escape') {
                    const hasEscape = video.classification.technique?.some(
                        tech => tech.toLowerCase() === 'escape'
                    );
                    if (!hasEscape) return false;
                } else {
                    const hasCategory = video.classification[f.techniqueCategory]?.length > 0;
                    if (!hasCategory) return false;
                }
            }

            // Guard filter
            if (f.guard) {
                const hasGuard = video.classification.guard_type?.some(
                    guard => guard.toLowerCase() === f.guard
                );
                if (!hasGuard) return false;
            }

            // Pass filter (detailed)
            if (f.pass) {
                const hasPass = video.classification.pass?.some(
                    pass => pass.toLowerCase() === f.pass
                );
                if (!hasPass) return false;
            }

            // Sweep filter (detailed)
            if (f.sweep) {
                const hasSweep = video.classification.sweep?.some(
                    sweep => sweep.toLowerCase() === f.sweep
                );
                if (!hasSweep) return false;
            }

            // Position filter
            if (f.position) {
                const hasPosition = video.classification.position?.some(
                    pos => pos.toLowerCase() === f.position
                );
                if (!hasPosition) return false;
            }

            // Submission filter (detailed)
            if (f.submission) {
                const hasSubmission = video.classification.submission?.some(
                    sub => sub.toLowerCase() === f.submission
                );
                if (!hasSubmission) return false;
            }

            // Takedown filter (detailed)
            if (f.takedown) {
                const hasTakedown = video.classification.takedown?.some(
                    td => td.toLowerCase() === f.takedown
                );
                if (!hasTakedown) return false;
            }

            // Escape filter (detailed)
            if (f.escape) {
                const hasEscape = video.classification.escape?.some(
                    es => es.toLowerCase() === f.escape
                );
                if (!hasEscape) return false;
            }

            return true;
        });
    }

    applyFilters() {
        this.filteredVideos = this._filterVideos();

        // Sort by view count (highest to lowest)
        this.filteredVideos.sort((a, b) => {
            const viewsA = parseInt(a.view_count) || 0;
            const viewsB = parseInt(b.view_count) || 0;
            return viewsB - viewsA;
        });

        // Cascade: update other filter dropdowns to show only available options
        this.updateAvailableFilterOptions();

        this.renderVideos();
        this.updateResultsCount();
    }

    // Cascading filters: repopulate each dropdown based on videos matching all OTHER active filters
    // Fight filters (athlete) are excluded from cascading
    updateAvailableFilterOptions() {
        // Technique classification dropdowns
        const techniqueFilterConfigs = [
            { key: 'guard', field: 'guard_type', selectId: 'guard-filter' },
            { key: 'pass', field: 'pass', selectId: 'pass-filter' },
            { key: 'sweep', field: 'sweep', selectId: 'sweep-filter' },
            { key: 'position', field: 'position', selectId: 'position-filter' },
            { key: 'submission', field: 'submission', selectId: 'submission-filter' },
            { key: 'takedown', field: 'takedown', selectId: 'takedown-filter' },
            { key: 'escape', field: 'escape', selectId: 'escape-filter' },
        ];

        techniqueFilterConfigs.forEach(({ key, field, selectId }) => {
            const sel = document.getElementById(selectId);
            if (!sel) return;

            // Get videos matching all filters EXCEPT this one
            const videos = this._filterVideos({ [key]: '' });
            const counts = new Map();
            videos.forEach(video => {
                if (video.isFight || !video.classification) return;
                const values = video.classification[field];
                if (values) {
                    values.forEach(v => {
                        const k = String(v).trim();
                        if (k) counts.set(k, (counts.get(k) || 0) + 1);
                    });
                }
            });

            this._repopulateSelect(sel, counts, this.filters[key]);
        });

        // Channel filter (applies to both fight and technique videos)
        const channelSel = document.getElementById('channel-filter');
        if (channelSel) {
            const channelVideos = this._filterVideos({ channel: '' });
            const channelCounts = new Map();
            channelVideos.forEach(video => {
                if (video.channel_name) {
                    const k = String(video.channel_name).trim();
                    if (k) channelCounts.set(k, (channelCounts.get(k) || 0) + 1);
                }
            });
            this._repopulateSelect(channelSel, channelCounts, this.filters.channel);
        }

        // Technique category filter: disable categories with no matching videos
        const techCatSel = document.getElementById('technique-category-filter');
        if (techCatSel) {
            const techCatVideos = this._filterVideos({ techniqueCategory: '' });
            const availableCategories = new Set();
            techCatVideos.forEach(video => {
                if (video.isFight || !video.classification) return;
                if (video.classification.pass?.length > 0) availableCategories.add('pass');
                if (video.classification.sweep?.length > 0) availableCategories.add('sweep');
                if (video.classification.submission?.length > 0) availableCategories.add('submission');
                if (video.classification.takedown?.length > 0) availableCategories.add('takedown');
                if (video.classification.technique?.some(t => t.toLowerCase() === 'escape')) availableCategories.add('escape');
                if (video.classification.technique?.length > 0) availableCategories.add('technique');
            });

            Array.from(techCatSel.options).forEach(option => {
                if (option.value === '') return; // "All Types" always available
                option.disabled = !availableCategories.has(option.value);
                option.style.opacity = option.disabled ? '0.4' : '1';
            });
        }
    }

    // Helper: repopulate a <select> from a counts map, preserving current selection
    _repopulateSelect(sel, countsMap, currentValue) {
        // Keep the first option (default "All ..." placeholder)
        while (sel.options.length > 1) sel.remove(1);

        Array.from(countsMap.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([name, cnt]) => {
                const option = document.createElement('option');
                option.value = name.toLowerCase();
                option.textContent = `${name} (${cnt})`;
                sel.appendChild(option);
            });

        // Restore selected value
        if (currentValue) {
            sel.value = currentValue;
        }
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

        // Limit cards on mobile more aggressively, even when searching
        const isSearching = !!this.searchQuery;
        const maxToRender = this.isMobile 
            ? Math.min(this.filteredVideos.length, this.DEFAULT_MAX_CARDS) // Mobile: always limit
            : (isSearching ? Math.min(this.filteredVideos.length, 300) : Math.min(this.filteredVideos.length, this.DEFAULT_MAX_CARDS)); // Desktop: limit search to 300

        // Use DocumentFragment for better performance (batch DOM insertions)
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < maxToRender; i++) {
            const card = this.createVideoCard(this.filteredVideos[i]);
            fragment.appendChild(card);
        }
        
        // Single DOM insertion instead of multiple
        grid.appendChild(fragment);

        // If we trimmed the results, show a small hint at the bottom
        if (this.filteredVideos.length > maxToRender) {
            const hint = document.createElement('div');
            hint.className = 'results-hint';
            hint.textContent = `Showing ${maxToRender} of ${this.filteredVideos.length} matches — refine search or filters to see more`;
            hint.style.marginTop = '12px';
            hint.style.color = 'var(--text-secondary)';
            hint.style.textAlign = 'center';
            grid.appendChild(hint);
        }
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';

        // Extract video ID from YouTube link
        const videoId = this.extractVideoId(video.youtube_link);
        const thumbnailUrl = videoId 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : 'https://via.placeholder.com/480x360?text=No+Thumbnail';

        // Get language flag
        const languageFlag = this.getLanguageFlag(video.language);

        // Create tags HTML
        const tagsHTML = this.createTagsHTML(video.classification, video);

        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${thumbnailUrl}" alt="${this.escapeHtml(video.title)}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/480x360?text=No+Thumbnail'">
                ${languageFlag ? `<div class="language-flag">${languageFlag}</div>` : ''}
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

    createTagsHTML(classification, video) {
        const tags = [];

        // Add Fight tag if video has athletes (indicating it's a fight)
        if (video && video.athletes && video.athletes.length > 0) {
            tags.push(`<span class="tag fight">🥊 Fight</span>`);
        }

        if (!classification) return tags.join('');

        // Add guard tags first (show up to first two guard types as tags)
        if (classification.guard_type && classification.guard_type.length > 0) {
            classification.guard_type.slice(0, 2).forEach(g => {
                tags.push(`<span class="tag guard">${this.escapeHtml(g)}</span>`);
            });
        }

        // Add pass tags
        if (classification.pass && classification.pass.length > 0) {
            classification.pass.slice(0, 2).forEach(pass => {
                tags.push(`<span class="tag pass">🚶 ${this.escapeHtml(pass)}</span>`);
            });
        }

        // Add sweep tags
        if (classification.sweep && classification.sweep.length > 0) {
            classification.sweep.slice(0, 2).forEach(sweep => {
                tags.push(`<span class="tag sweep">🌀 ${this.escapeHtml(sweep)}</span>`);
            });
        }

        // Add submission tags
        if (classification.submission && classification.submission.length > 0) {
            classification.submission.slice(0, 2).forEach(sub => {
                tags.push(`<span class="tag submission">🎯 ${this.escapeHtml(sub)}</span>`);
            });
        }

        // Add takedown tags
        if (classification.takedown && classification.takedown.length > 0) {
            classification.takedown.slice(0, 2).forEach(td => {
                tags.push(`<span class="tag takedown">🥋 ${this.escapeHtml(td)}</span>`);
            });
        }

        // Add position tags
        if (classification.position && classification.position.length > 0) {
            classification.position.slice(0, 2).forEach(pos => {
                tags.push(`<span class="tag position">📍 ${this.escapeHtml(pos)}</span>`);
            });
        }

        // Add escape tags
        if (classification.escape && classification.escape.length > 0) {
            classification.escape.slice(0, 2).forEach(es => {
                tags.push(`<span class="tag escape">🛟 ${this.escapeHtml(es)}</span>`);
            });
        }

        // Add other technique tags (limited to avoid clutter)
        if (classification.technique && classification.technique.length > 0) {
            classification.technique.slice(0, 2).forEach(tech => {
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

    getLanguageFlag(languageCode) {
        const languageFlags = {
            'en': '🇺🇸', // English
            'pt': '🇧🇷', // Portuguese
            'es': '🇪🇸', // Spanish
            'fr': '🇫🇷', // French
            'de': '🇩🇪', // German
            'it': '🇮🇹', // Italian
            'ja': '🇯🇵', // Japanese
            'ko': '🇰🇷', // Korean
            'ru': '🇷🇺', // Russian
            'pl': '🇵🇱', // Polish
            'nl': '🇳🇱', // Dutch
            'sv': '🇸🇪', // Swedish
            'no': '🇳🇴', // Norwegian
            'da': '🇩🇰', // Danish
            'fi': '🇫🇮', // Finnish
            'tr': '🇹🇷', // Turkish
            'ar': '🇸🇦', // Arabic
            'hi': '🇮🇳', // Hindi
            'th': '🇹🇭', // Thai
            'vi': '🇻🇳', // Vietnamese
            'id': '🇮🇩', // Indonesian
        };

        // Try to match the full code first, then fall back to language prefix
        const flag = languageFlags[languageCode] || languageFlags[languageCode.split('-')[0]];
        return flag || '🌐'; // Globe emoji as fallback
    }

    updateResultsCount() {
        const count = document.getElementById('results-count');
        const total = this.allVideos.length;
        const filtered = this.filteredVideos.length;

        if (filtered === total) {
            count.textContent = `Showing all ${total} techniques`;
        } else {
            // If we are not searching and results are trimmed, indicate the
            // number shown vs the total matches here as well.
            if (!this.searchQuery && filtered > this.DEFAULT_MAX_CARDS) {
                count.textContent = `Showing ${this.DEFAULT_MAX_CARDS} of ${filtered} matching techniques (refine search to see more)`;
            } else {
                count.textContent = `Showing ${filtered} of ${total} techniques`;
            }
        }
    }

    resetFilters() {
        // Reset filter object
        this.filters = {
            techniqueCategory: '',
            guard: '',
            pass: '',
            sweep: '',
            position: '',
            submission: '',
            takedown: '',
            channel: '',
            athlete: ''
        };

        // Reset search
        this.searchQuery = '';
        document.getElementById('search-input').value = '';
        document.getElementById('clear-search').style.display = 'none';

        // Reset select elements
        document.getElementById('technique-category-filter').value = '';
        document.getElementById('guard-filter').value = '';
        document.getElementById('pass-filter').value = '';
        document.getElementById('sweep-filter').value = '';
        document.getElementById('position-filter').value = '';
        document.getElementById('submission-filter').value = '';
        document.getElementById('takedown-filter').value = '';
        const channelSelect = document.getElementById('channel-filter');
        if (channelSelect) channelSelect.value = '';
        const athleteSelect = document.getElementById('athlete-filter');
        if (athleteSelect) athleteSelect.value = '';

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
