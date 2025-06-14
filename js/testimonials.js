// Simplified Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
    // Get all testimonial elements
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const controls = document.querySelector('.testimonial-controls');
    const sliderContainer = document.querySelector('.testimonials-slider');
    
    if (!testimonialItems.length || !dots.length || !prevBtn || !nextBtn) {
        console.error('Testimonial elements not found');
        return;
    }
    
    console.log('Found testimonial elements:', {
        items: testimonialItems.length,
        dots: dots.length
    });
    
    let currentSlide = 0;
    let isAnimating = false;
    
    // Function to update the controls position based on the height of the active testimonial
    function updateControlsPosition() {
        const activeSlide = testimonialItems[currentSlide];
        if (activeSlide) {
            const slideHeight = activeSlide.offsetHeight;
            controls.style.marginTop = (slideHeight + 30) + 'px'; // Added extra padding
        }
    }
    
    // Initialize slider - show first slide
    function initSlider() {
        testimonialItems.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('active');
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            } else {
                item.classList.remove('active');
                item.style.display = 'none';
                item.style.opacity = '0';
                item.style.transform = 'translateX(50px)';
            }
        });
        
        dots.forEach((dot, index) => {
            if (index === 0) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Delay the position update to ensure content is fully rendered
        setTimeout(updateControlsPosition, 100);
    }
    
    // Show a specific slide
    function showSlide(n) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Hide current slide
        testimonialItems[currentSlide].classList.remove('active');
        testimonialItems[currentSlide].style.opacity = '0';
        testimonialItems[currentSlide].style.transform = 'translateX(-50px)';
        
        // Update dots
        dots[currentSlide].classList.remove('active');
        dots[n].classList.add('active');
        
        // After a short delay, hide previous slide and show new one
        setTimeout(() => {
            testimonialItems[currentSlide].style.display = 'none';
            
            // Show new slide
            testimonialItems[n].style.display = 'block';
            
            // Force reflow
            testimonialItems[n].offsetHeight;
            
            // Animate in
            testimonialItems[n].style.opacity = '1';
            testimonialItems[n].style.transform = 'translateX(0)';
            testimonialItems[n].classList.add('active');
            
            // Update current slide
            currentSlide = n;
            
            // Update controls position with a slight delay
            setTimeout(updateControlsPosition, 100);
            
            // Reset animation flag
            setTimeout(() => {
                isAnimating = false;
            }, 300);
        }, 300);
    }
    
    // Next slide
    function nextSlide() {
        if (isAnimating) return;
        let next = currentSlide + 1;
        if (next >= testimonialItems.length) {
            next = 0;
        }
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        if (isAnimating) return;
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = testimonialItems.length - 1;
        }
        showSlide(prev);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', function() {
        console.log('Next button clicked');
        nextSlide();
    });
    
    prevBtn.addEventListener('click', function() {
        console.log('Prev button clicked');
        prevSlide();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            console.log('Dot clicked:', index);
            if (index !== currentSlide && !isAnimating) {
                showSlide(index);
            }
        });
    });
    
    // Window resize handler to adjust control positions
    window.addEventListener('resize', function() {
        setTimeout(updateControlsPosition, 100);
    });
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-slide on interaction
    const sliderElements = [prevBtn, nextBtn, ...dots];
    sliderElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        element.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // Initialize the slider
    initSlider();
});