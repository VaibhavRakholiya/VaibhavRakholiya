// ============= Header Scroll Effect =============
const header = document.querySelector('header');
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    // Add sticky class to header when scrolling
    if (window.scrollY > 100) {
        header.classList.add('sticky');
        backToTopBtn.classList.add('active');
    } else {
        header.classList.remove('sticky');
        backToTopBtn.classList.remove('active');
    }
});

// ============= Back to Top Button =============
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============= Mobile Navigation =============
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============= Active Navigation Links =============
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

// Function to highlight active section
function highlightCurrentSection() {
    let current = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href && href.substring(1) === current) {
            item.classList.add('active');
        }
    });
    
    // If at the very top of the page, highlight home
    if (window.scrollY < 100) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#home') {
                item.classList.add('active');
            }
        });
    }
}

// Highlight section on page load
document.addEventListener('DOMContentLoaded', highlightCurrentSection);

// Highlight section on scroll
window.addEventListener('scroll', highlightCurrentSection);

// ============= Project Filtering =============
document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Show all projects initially
    projectItems.forEach(item => {
        item.classList.add('show');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.add('show');
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.classList.remove('show');
                }
            });
        });
    });
});

// Add fade-in animation if not already defined
if (!document.querySelector('#project-animation-style')) {
    const style = document.createElement('style');
    style.id = 'project-animation-style';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============= Contact Form =============
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const form = e.target;
            const data = new FormData(form);
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple form validation
            if (name === '' || email === '' || subject === '' || message === '') {
                alert('Please fill in all fields');
                return;
            }

             fetch("https://formsubmit.co/rakholiyavaibhav@gmail.com", 
                {
                    method: "POST",
                    body: data,
                })
                .then(response => {
                    if (response.ok) 
                    {
                        alert('Your message has been sent successfully! Thank you for contacting me.');
                    // form.reset();
                    } else 
                    {
                        
                    }
                })
                .catch(error => {
                    // document.getElementById("form-status").innerHTML = "<p style='color:red;'>Error: " + error.message + "</p>";
                });
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show a success message
            
            // Reset the form
            contactForm.reset();
        });
    }
});

// ============= Scroll Animation =============
// Adding smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});

// ============= Page Loading Animation =============
window.addEventListener('load', () => {
    // Hide preloader if implemented
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    
    // Add animation classes to elements
    document.querySelectorAll('.hero-text h1, .hero-text h2, .hero-text h3').forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, 300 * index);
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
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function tick() {
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
    }
    setTimeout(tick, 600);
}

// ============= Scroll Progress Bar =============
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
    const updateProgress = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const height = h.scrollHeight - h.clientHeight;
        const pct = height > 0 ? (scrolled / height) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
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
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            const value = Math.floor(target * eased);
            el.textContent = value + suffix;
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
// Animate skills when they come into view
const skillItems = document.querySelectorAll('.skill-item');

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

skillItems.forEach(item => {
    observer.observe(item);
});

// ============= Project Animation =============
// Animate projects when they come into view
const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
    observer.observe(item);
});

// ============= Form Focus Effects =============
// Add animation to form inputs when focused
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (input.value === '') {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Check if form inputs have value on page load
window.addEventListener('load', () => {
    formInputs.forEach(input => {
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
});
