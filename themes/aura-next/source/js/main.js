document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Cursor logic using requestAnimationFrame
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        const loop = () => {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        };
        loop();

        // Attach to DOM specifically to avoid event-bubbling CPU overload on complex nodes
        const attachHover = () => {
            document.querySelectorAll('.hover-target, a, button').forEach(target => {
                target.addEventListener('mouseenter', () => {
                    if (follower) follower.classList.add('hovering');
                });
                target.addEventListener('mouseleave', () => {
                    if (follower) follower.classList.remove('hovering');
                });
            });
        };
        attachHover();
    } else {
        // Hide custom cursor on mobile / touch devices
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
    }

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.05
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and archive panels for reveal animation
    const animatedElements = document.querySelectorAll('.post-card, .archive-panel');
    animatedElements.forEach(el => {
        animateOnScroll.observe(el);
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
        // Wrap table for scroll containment
        const table = figure.querySelector('table');
        if (table && !table.parentElement.classList.contains('code-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }

        // Add copy button (avoid duplicating)
        if (figure.querySelector('.code-copy-btn')) return;
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

    // 7. Post Hero visual smooth 3D tilt — Zero Jitter / Lerp Optimization
    const heroCard = document.querySelector('.post-hero-card');
    if (heroCard) {
        const visual = heroCard.querySelector('.post-hero-visual');
        let rect = heroCard.getBoundingClientRect();
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let rafId = null;

        const lerp = (start, end, factor) => start + (end - start) * factor;

        const updateRotation = () => {
            // Smoothly interpolate towards target
            currentX = lerp(currentX, targetX, 0.1);
            currentY = lerp(currentY, targetY, 0.1);

            heroCard.style.transform = `perspective(2000px) rotateX(${currentY}deg) rotateY(${currentX}deg) scale3d(1.02, 1.02, 1.02)`;
            if (visual) {
                // Parallax translation follows tilt
                visual.style.transform = `scale(1.1) translate3d(${currentX * 0.6}px, ${-currentY * 0.6}px, 0)`;
            }

            // Always run the loop if there's significant delta to reach zero or target
            if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
                rafId = requestAnimationFrame(updateRotation);
            } else {
                rafId = null;
            }
        };

        heroCard.addEventListener('mouseenter', () => {
            rect = heroCard.getBoundingClientRect();
        });

        heroCard.addEventListener('mousemove', (e) => {
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            targetX = (x - 0.5) * 30;
            targetY = (0.5 - y) * 20;

            if (!rafId) rafId = requestAnimationFrame(updateRotation);
        });

        heroCard.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) rafId = requestAnimationFrame(updateRotation);
        });

        // Recalculate rect on window resize
        window.addEventListener('resize', () => {
            rect = heroCard.getBoundingClientRect();
        });
    }

    // 8. Instant Search Logic
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
                if (!searchData) {
                    fetch('/search.json').then(res => res.json()).then(data => searchData = data).catch(err => console.log("Search database not built yet."));
                }
            } else {
                searchInput.value = ''; searchResult.innerHTML = '';
            }
        };
        searchBtn.addEventListener('click', toggleSearch);
        searchClose.addEventListener('click', toggleSearch);
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) toggleSearch();
        });

        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            if (!query || !searchData) { searchResult.innerHTML = ''; return; }
            
            const results = searchData.filter(item => {
                return (item.title && item.title.toLowerCase().includes(query)) || 
                       (item.content && item.content.toLowerCase().includes(query));
            }).slice(0, 8);
            
            if (results.length === 0) {
                searchResult.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-secondary);">No pulse found for "<b>${query}</b>"</div>`;
                return;
            }
            
            searchResult.innerHTML = results.map(item => {
                const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                const title = item.title.replace(regex, `<span class="search-keyword">$1</span>`);
                const contentText = item.content.replace(/<[^>]+>/g, '');
                const snippetIndex = contentText.toLowerCase().indexOf(query);
                
                let snippet = '';
                if (snippetIndex > -1) {
                    const start = Math.max(0, snippetIndex - 30);
                    const end = Math.min(contentText.length, snippetIndex + query.length + 50);
                    snippet = (start > 0 ? '...' : '') + contentText.substring(start, end).replace(regex, `<span class="search-keyword">$1</span>`) + '...';
                } else {
                    snippet = contentText.substring(0, 80) + '...';
                }
                
                let finalUrl = item.url || '';
                if (finalUrl.startsWith('//')) {
                    finalUrl = finalUrl.replace(/^\/+/, '/');
                } else if (!finalUrl.startsWith('http') && !finalUrl.startsWith('/')) {
                    finalUrl = '/' + finalUrl;
                }
                
                return `
                    <a href="${finalUrl}" class="search-result-item">
                        <div class="search-result-title">${title}</div>
                        <div class="search-result-content">${snippet}</div>
                    </a>
                `;
            }).join('');
        });
    }

    // 9. Smart Image Wrapping for Premium Captions & Gallery Style
    document.querySelectorAll('.post-content img').forEach(img => {
        if (img.closest('figure') || img.closest('.video-card')) return;
        const figure = document.createElement('figure');
        img.parentNode.insertBefore(figure, img);
        figure.appendChild(img);
        const altText = img.getAttribute('alt');
        if (altText && altText.trim() !== '') {
            const fig = document.createElement('figcaption');
            fig.textContent = altText;
            figure.appendChild(fig);
        }
    });

    // 10. Image Zoom
    if (typeof mediumZoom !== 'undefined') {
        const zoom = mediumZoom('.post-content figure img', {
            margin: 24,
            background: 'var(--bg)',
            scrollOffset: 40
        });
        
        zoom.on('open', () => {
             document.body.classList.add('hide-cursor');
             const overlay = document.querySelector('.medium-zoom-overlay');
             if(overlay) {
                  overlay.style.backgroundColor = 'var(--bg)';
                  overlay.style.backdropFilter = 'blur(12px)';
                  overlay.style.opacity = '0.92';
             }
        });

        zoom.on('closed', () => {
            document.body.classList.remove('hide-cursor');
        });
    }
});