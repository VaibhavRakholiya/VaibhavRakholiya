// ============= Shared =============
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

// ============= Header / Back to top (single rAF-throttled scroll pass) =============
const header = document.querySelector('header');
const backToTopBtn = document.querySelector('.back-to-top');
const scrollProgress = document.getElementById('scrollProgress');

let scrollTicking = false;

function onScrollFrame() {
    const scrolled = window.scrollY;

    if (header) header.classList.toggle('sticky', scrolled > 100);
    if (backToTopBtn) backToTopBtn.classList.toggle('active', scrolled > 100);

    if (scrollProgress) {
        const h = document.documentElement;
        const height = h.scrollHeight - h.clientHeight;
        scrollProgress.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    }

    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScrollFrame);
    }
}, { passive: true });

onScrollFrame();

// ============= Back to Top Button =============
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: scrollBehavior });
    });
}

// ============= Mobile Navigation =============
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
    if (!hamburger || !navLinks) return;
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const open = !navLinks.classList.contains('active');
        hamburger.classList.toggle('active', open);
        navLinks.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Escape closes the menu and returns focus to the toggle
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
    });

    // Clicking outside the open menu closes it
    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('active')) return;
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
}

// ============= Active Navigation Links =============
// Observer instead of reading offsetTop for every section on every scroll tick.
const navSections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a[href*="#"]');

if (navSections.length && navItems.length) {
    const setActive = (id) => {
        navItems.forEach(item => {
            const href = item.getAttribute('href') || '';
            item.classList.toggle('active', href.endsWith('#' + id));
        });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        // Pick the entry closest to the middle of the viewport
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) {
            visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            setActive(visible[0].target.id);
        }
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    navSections.forEach(section => sectionObserver.observe(section));

    // At the very top of the page, Home wins
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) setActive('home');
    }, { passive: true });
}

// ============= Project Filtering =============
document.addEventListener('DOMContentLoaded', function () {
    const projectItems = document.querySelectorAll('.project-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const countEl = document.getElementById('filterCount');
    const noResults = document.getElementById('noResults');

    if (!filterButtons.length) return;

    const apply = (filterValue, label) => {
        let shown = 0;

        projectItems.forEach(item => {
            const match = filterValue === 'all' || item.classList.contains(filterValue);
            item.classList.toggle('show', match);
            if (match) shown++;
        });

        if (noResults) noResults.hidden = shown > 0;
        if (countEl) {
            countEl.textContent = shown === 0
                ? ''
                : `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}${filterValue === 'all' ? '' : ' in ' + label}`;
        }
    };

    projectItems.forEach(item => item.classList.add('show'));
    apply('all', 'All Projects');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                const isActive = btn === button;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', String(isActive));
            });

            apply(button.getAttribute('data-filter'), button.textContent.trim());
        });
    });
});

// ============= Lazy Project Videos =============
// The projects page carries 42 clips. Nothing is fetched until the visitor
// asks for it: hover on a fine pointer, tap on a coarse one.
document.addEventListener('DOMContentLoaded', function () {
    const mediaBlocks = document.querySelectorAll('.project-media[data-video]');
    if (!mediaBlocks.length) return;

    const coarsePointer = window.matchMedia('(hover: none)').matches;
    let playing = null;

    const stop = (media) => {
        const video = media.querySelector('video');
        if (!video) return;
        video.pause();
        media.classList.remove('is-playing');
        if (playing === media) playing = null;
    };

    const start = (media) => {
        const video = media.querySelector('video');
        if (!video) return;

        // Only one clip plays at a time
        if (playing && playing !== media) stop(playing);

        const source = video.querySelector('source[data-src]');
        if (source) {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
            video.load();
        }

        const played = video.play();
        if (played && typeof played.catch === 'function') played.catch(() => {});

        media.classList.add('is-playing');
        playing = media;
    };

    mediaBlocks.forEach(media => {
        const hint = media.querySelector('.video-hint');
        if (hint && !coarsePointer) hint.textContent = 'Hover to play';

        if (coarsePointer) {
            media.addEventListener('click', () => {
                if (media.classList.contains('is-playing')) stop(media);
                else start(media);
            });
        } else {
            media.addEventListener('mouseenter', () => start(media));
            media.addEventListener('mouseleave', () => stop(media));
        }
    });

    // Pause anything that scrolls out of view so background decoding stops
    const viewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && entry.target.classList.contains('is-playing')) {
                stop(entry.target);
            }
        });
    }, { threshold: 0 });

    mediaBlocks.forEach(media => viewObserver.observe(media));

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && playing) stop(playing);
    });
});

// ============= Contact Form =============
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const status = document.getElementById('formStatus');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.innerHTML : '';

    const say = (kind, html) => {
        if (!status) return;
        status.className = 'form-status ' + kind;
        status.innerHTML = html;
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!contactForm.reportValidity()) return;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        }
        say('', '');

        try {
            const response = await fetch('https://formsubmit.co/rakholiyavaibhav@gmail.com', {
                method: 'POST',
                body: new FormData(contactForm)
            });

            if (!response.ok) throw new Error('Request failed with status ' + response.status);

            say('ok', 'Thanks — your message is on its way. I usually reply within a day.');
            contactForm.reset();
        } catch (err) {
            // Keep what they typed; give them a route that does not depend on this form.
            say('err', 'That did not go through. Please email me directly at ' +
                '<a href="mailto:rakholiyavaibhav@gmail.com">rakholiyavaibhav@gmail.com</a>.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalLabel;
            }
        }
    });
});

// ============= Smooth in-page scrolling =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 12,
            behavior: scrollBehavior
        });

        // Move keyboard focus with the viewport
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
    });
});

// ============= Looping Role Typer =============
const roleTyper = document.getElementById('roleTyper');
if (roleTyper) {
    const roles = [
        'Unity Games',
        'AR / VR Worlds',
        'Multiplayer Arenas',
        'Hyper-Casual Hits',
        'Immersive XR'
    ];

    if (reduceMotion) {
        roleTyper.textContent = roles[0];
    } else {
        let roleIdx = 0;
        let charIdx = 0;
        let deleting = false;

        const tick = () => {
            const current = roles[roleIdx];
            roleTyper.textContent = current.substring(0, charIdx);

            if (!deleting && charIdx < current.length) {
                charIdx++;
                setTimeout(tick, 75);
            } else if (!deleting && charIdx === current.length) {
                deleting = true;
                setTimeout(tick, 1600);
            } else if (deleting && charIdx > 0) {
                charIdx--;
                setTimeout(tick, 35);
            } else {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                setTimeout(tick, 250);
            }
        };

        setTimeout(tick, 600);
    }
}

// ============= Reveal on Scroll =============
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
}

// ============= Animated Counters =============
const counters = document.querySelectorAll('.stat-number[data-count]');
if (counters.length) {
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';

        if (reduceMotion) {
            el.textContent = target + suffix;
            return;
        }

        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
            el.textContent = Math.floor(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(el => counterObserver.observe(el));
}

// ============= Skill Animation =============
const skillItems = document.querySelectorAll('.skill-item');
if (skillItems.length) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    skillItems.forEach(item => skillObserver.observe(item));
}

// ============= Form Focus Effects =============
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
    input.addEventListener('blur', () => {
        if (input.value === '') input.parentElement.classList.remove('focused');
    });

    if (input.value !== '') input.parentElement.classList.add('focused');
});

// ============= Footer year =============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
