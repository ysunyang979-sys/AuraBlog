document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Cursor logic using requestAnimationFrame for better performance
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Detect if device supports hover
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move inner cursor instantly
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Smooth follower animation loop
        const loop = () => {
            // lerp (linear interpolation)
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        };
        loop();

        // Hover Effect specific to elements
        const hoverTargets = document.querySelectorAll('.hover-target, a, button');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        animateOnScroll.observe(card);
    });

    // 3. Theme Toggle Switch Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') {
                el.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                el.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 4. TOC Collapse Logic
    const tocBtn = document.getElementById('toc-toggle');
    const tocEl = document.getElementById('post-toc');
    if (tocBtn && tocEl) {
        tocBtn.addEventListener('click', () => {
            tocEl.classList.toggle('collapsed');
        });
    }

    // 5. Code Copy Button Injection & Logic
    const highlights = document.querySelectorAll('.post-content figure.highlight');
    highlights.forEach(figure => {
        const table = figure.querySelector('table');
        if (table) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }

        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = 'Copy';
        figure.insertBefore(btn, figure.firstChild);

        btn.addEventListener('click', () => {
            const codeEl = figure.querySelector('.code pre');
            if (!codeEl) return;
            const codeText = codeEl.innerText;
            
            navigator.clipboard.writeText(codeText).then(() => {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                btn.textContent = 'Failed';
            });
        });
    });

    // 6. Markmap Mindmap Initialization
    const mindmaps = document.querySelectorAll('.post-content .markmap');
    mindmaps.forEach(el => {
        if (typeof markmap !== 'undefined') {
            const { Markmap, loadCSS, loadJS } = markmap;
            const content = el.textContent.trim();
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            
            // Put it in a container if needed
            const container = el.closest('.mindmap-container') || el.parentNode;
            container.innerHTML = '';
            container.appendChild(svg);
            
            const { Transformer } = markmap;
            const transformer = new Transformer();
            const { root, features } = transformer.transform(content);
            const { styles, scripts } = transformer.getAssets();
            if (styles) loadCSS(styles);
            if (scripts) loadJS(scripts, { getMarkmap: () => markmap });
            
            Markmap.create(svg, null, root);
        }
    });

    // 7. Post Hero Image 3D Parallax Hover
    const heroContainer = document.querySelector('.post-hero-image');
    if (heroContainer) {
        const img = heroContainer.querySelector('img');
        if (img) {
            heroContainer.style.perspective = '1000px';
            img.style.transformStyle = 'preserve-3d';
            img.style.willChange = 'transform';
            
            heroContainer.addEventListener('mousemove', (e) => {
                const rect = heroContainer.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                
                // Tilt multiplier controls extreme rotation intensity. scale(1.1) prevents edge clipping heavily.
                img.style.transform = `scale(1.1) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
            });
            
            heroContainer.addEventListener('mouseleave', () => {
                img.style.transform = `scale(1) rotateY(0deg) rotateX(0deg)`;
                img.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            });
            
            heroContainer.addEventListener('mouseenter', () => {
                img.style.transition = 'transform 0.1s ease-out';
            });
        }
    }

    // 7. Instant Search Logic
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResult = document.getElementById('search-result');
    let searchData = null;

    if (searchBtn && searchModal) {
        const toggleSearch = () => {
            searchModal.classList.toggle('active');
            if (searchModal.classList.contains('active')) {
                searchInput.focus();
                // Fetch search index generated by hexo-generator-searchdb
                if (!searchData) {
                    fetch('/search.json').then(res => res.json()).then(data => searchData = data).catch(err => console.log("Search database not built yet."));
                }
            } else {
                searchInput.value = ''; searchResult.innerHTML = ''; // reset on close
            }
        };
        searchBtn.addEventListener('click', toggleSearch);
        searchClose.addEventListener('click', toggleSearch);
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) toggleSearch();
        });

        // Real-time search processing
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            if (!query || !searchData) { searchResult.innerHTML = ''; return; }
            
            const results = searchData.filter(item => {
                return (item.title && item.title.toLowerCase().includes(query)) || 
                       (item.content && item.content.toLowerCase().includes(query));
            }).slice(0, 8); // Display top 8 results safely
            
            if (results.length === 0) {
                searchResult.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-secondary);">No pulse found for "<b>${query}</b>"</div>`;
                return;
            }
            
            searchResult.innerHTML = results.map(item => {
                const regex = new RegExp(`(${query})`, 'gi');
                const title = item.title.replace(regex, `<span class="search-keyword">$1</span>`);
                const contentText = item.content.replace(/<[^>]+>/g, ''); // strip HTML tags
                const snippetIndex = contentText.toLowerCase().indexOf(query);
                
                let snippet = '';
                if (snippetIndex > -1) {
                    const start = Math.max(0, snippetIndex - 30);
                    const end = Math.min(contentText.length, snippetIndex + query.length + 50);
                    snippet = (start > 0 ? '...' : '') + contentText.substring(start, end).replace(regex, `<span class="search-keyword">$1</span>`) + '...';
                } else {
                    snippet = contentText.substring(0, 80) + '...';
                }
                
                return `
                    <a href="${item.url}" class="search-result-item">
                        <div class="search-result-title">${title}</div>
                        <div class="search-result-content">${snippet}</div>
                    </a>
                `;
            }).join('');
        });
    }
});