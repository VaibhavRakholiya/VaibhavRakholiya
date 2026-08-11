// Testimonial slider — slides are stacked in one CSS grid cell, so the
// container sizes itself to the tallest quote and nothing needs measuring.
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.testimonials-slider');
    const items = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const controls = document.querySelector('.testimonial-controls');

    if (!slider || !items.length || !prevBtn || !nextBtn) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTOPLAY_MS = 10000;

    let current = 0;
    let timer = null;

    function show(n) {
        const next = (n + items.length) % items.length;

        items.forEach((item, i) => {
            const isActive = i === next;
            item.classList.toggle('active', isActive);
            // Hidden slides must not be reachable by keyboard or screen readers
            item.inert = !isActive;
            item.setAttribute('aria-hidden', String(!isActive));
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === next);
            dot.setAttribute('aria-current', String(i === next));
        });

        current = next;
    }

    const nextSlide = () => show(current + 1);
    const prevSlide = () => show(current - 1);

    function startAuto() {
        if (reduceMotion || timer) return;
        timer = setInterval(nextSlide, AUTOPLAY_MS);
    }

    function stopAuto() {
        clearInterval(timer);
        timer = null;
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => show(index));
    });

    // Arrow keys when focus is anywhere inside the slider or its controls
    [slider, controls].forEach(el => {
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        });
    });

    // Pause on any interaction with the whole section, not just the buttons
    [slider, controls].forEach(el => {
        if (!el) return;
        el.addEventListener('mouseenter', stopAuto);
        el.addEventListener('focusin', stopAuto);
        el.addEventListener('mouseleave', startAuto);
        el.addEventListener('focusout', startAuto);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAuto();
        else startAuto();
    });

    show(0);
    startAuto();
});
