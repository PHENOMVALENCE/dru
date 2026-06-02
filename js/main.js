/* ============================================
   Main JavaScript - Portfolio Functionality
   ============================================ */

// Configuration - easily changeable endpoint for backend
const API_URL = "YOUR_BACKEND_URL";

// ============================================
// Initialize AOS (Animate On Scroll)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        disable: 'mobile'
    });
});

// ============================================
// Navigation Functionality
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect for navbar
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active section highlighting
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ============================================
// Typed Text Effect
// ============================================
const typedElement = document.getElementById('typed-text');
const typedTexts = [
    'Data Analyst',
    'Excel Specialist',
    'Dashboard Builder',
    'Data Enthusiast'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentText = typedTexts[textIndex];
    
    if (isDeleting) {
        typedElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typedElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typedTexts.length;
        typingSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeText, typingSpeed);
}

// Start typing effect
document.addEventListener('DOMContentLoaded', function() {
    if (typedElement) {
        setTimeout(typeText, 1000);
    }
});

// ============================================
// Counter Animation
// ============================================
const counters = document.querySelectorAll('.stat-number');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
    
    countersAnimated = true;
}

// Intersection Observer for counters
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// ============================================
// Project Filtering
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Filter projects with animation
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ============================================
// Contact Form Handling
// ============================================
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!validateForm(formData)) {
            showFormMessage('Please fill in all fields correctly.', 'error');
            return;
        }
        
        // Log data to console (as per requirement)
        console.log('Form Submission Data:', formData);
        console.log('Would send to:', API_URL);
        
        // Show success message
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Here you would typically send to backend:
        // sendToBackend(formData);
    });
}

function validateForm(data) {
    // Basic validation
    if (!data.name.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) {
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    return true;
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// Placeholder function for backend integration
async function sendToBackend(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showFormMessage('Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            showFormMessage('Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('An error occurred. Please try again later.', 'error');
    }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Skill Cards Hover Effect Enhancement
// ============================================
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with stagger animation class
document.querySelectorAll('.stagger-item').forEach(item => {
    animationObserver.observe(item);
});

// ============================================
// Timeline Animation
// ============================================
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = item.classList.contains('left') ? 'translateX(-30px)' : 'translateX(30px)';
    item.style.transition = 'all 0.6s ease';
    timelineObserver.observe(item);
});

// ============================================
// Preloader (Optional Enhancement)
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        AOS.refresh();
    }, 100);
});

// ============================================
// Console Easter Egg
// ============================================
console.log('%c Welcome to my Portfolio! ', 'background: linear-gradient(135deg, #00D4FF, #7C3AED); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;');
console.log('%c Built with passion for Data Science & ML ', 'color: #00D4FF; font-size: 14px;');
