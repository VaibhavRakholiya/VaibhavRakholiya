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
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show a success message
            alert('Your message has been sent successfully!');
            
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

// ============= Type Animation Effect =============
// This function creates a typing effect for specified elements
function typeAnimation(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

// Apply typing effect to the hero subtitle if needed
const heroSubtitle = document.querySelector('.hero-text h3');
if (heroSubtitle) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            typeAnimation(heroSubtitle, heroSubtitle.textContent, 100);
        }, 1000);
    });
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
