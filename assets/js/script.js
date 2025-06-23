// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 54, 93, 0.98)';
    } else {
        header.style.background = 'rgba(26, 54, 93, 0.95)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handler
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Create WhatsApp message
    let whatsappMessage = `Olá! Gostaria de solicitar um orçamento:\n\n`;
    whatsappMessage += `*Nome:* ${name}\n`;
    whatsappMessage += `*Telefone:* ${phone}\n`;
    if (email) {
        whatsappMessage += `*E-mail:* ${email}\n`;
    }
    whatsappMessage += `*Serviço:* ${service}\n`;
    if (message) {
        whatsappMessage += `*Mensagem:* ${message}\n`;
    }
    whatsappMessage += `\nAguardo retorno. Obrigado!`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/5541989017944?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Reset form
    this.reset();
    
    // Show success message
    showNotification('Mensagem enviada! Você será redirecionado para o WhatsApp.', 'success');
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .differential-card, .about-text, .about-image');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    input.value = value;
}

// Add phone formatting to phone input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
}

// Form validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    
    if (!name) {
        showNotification('Por favor, informe seu nome.', 'error');
        return false;
    }
    
    if (!phone) {
        showNotification('Por favor, informe seu telefone.', 'error');
        return false;
    }
    
    if (!service) {
        showNotification('Por favor, selecione um serviço.', 'error');
        return false;
    }
    
    return true;
}

// Update form submit handler to include validation
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Get service name from select option
    const serviceSelect = document.getElementById('service');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    
    // Create WhatsApp message
    let whatsappMessage = `Olá! Gostaria de solicitar um orçamento:\n\n`;
    whatsappMessage += `*Nome:* ${name}\n`;
    whatsappMessage += `*Telefone:* ${phone}\n`;
    if (email) {
        whatsappMessage += `*E-mail:* ${email}\n`;
    }
    whatsappMessage += `*Serviço:* ${serviceName}\n`;
    if (message) {
        whatsappMessage += `*Mensagem:* ${message}\n`;
    }
    whatsappMessage += `\nAguardo retorno. Obrigado!`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/5541989017944?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Reset form
    this.reset();
    
    // Show success message
    showNotification('Mensagem enviada! Você será redirecionado para o WhatsApp.', 'success');
});

// Loading animation for page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Add loading styles
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        if (window.scrollY > 500) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});

// Add scroll to top button
document.addEventListener('DOMContentLoaded', () => {
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #d69e2e;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(214, 158, 46, 0.3);
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.transform = 'scale(1.1)';
    });
    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(scrollButton);
});

