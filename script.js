/* Custom Cursor */
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    mouse.x = posX;
    mouse.y = posY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Animate outline with a slight delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });

    // Update CSS variables for Spotlight Effect
    document.documentElement.style.setProperty('--mouse-x', `${posX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${posY}px`);
});

/* Scroll Sections Active Link */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (sectionsClass) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link');
            } else {
                sectionsClass.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

/* Scroll Reveal Animation */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all text elements and cards to animate
const hiddenElements = document.querySelectorAll('p, h1, h2, h3, a.button, .nav__item, .projects__card, .about__info, .contact__content, .footer__list');
hiddenElements.forEach((el) => {
    el.classList.add('hidden');
    observer.observe(el);
});

/* Typing Effect */
const textToType = "I make robots, and then educate them.";
const typingElement = document.getElementById("typing-text");
let charIndex = 0;

function typeText() {
    if (typingElement && charIndex < textToType.length) {
        typingElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 50); // Typing speed
    }
}

// Start typing when the page loads
window.addEventListener('load', typeText);

/* 3D Tilt Effect for Cards */
const cards = document.querySelectorAll('.projects__card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

/* Particle Background with Spotlight & Interaction */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const canvasBlurred = document.getElementById('particles-canvas-blurred');
const ctxBlurred = canvasBlurred.getContext('2d');

let particlesArray;
let textRects = [];

// Update text bounding boxes for collision detection
function updateTextRects() {
    const elements = document.querySelectorAll('h1, h2, p, a.button, .projects__card');
    textRects = [];
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Only consider elements currently in viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            textRects.push({
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                centerX: rect.left + rect.width / 2,
                centerY: rect.top + rect.height / 2,
                radius: Math.max(rect.width, rect.height) / 1.8 // Approximate collision radius
            });
        }
    });
}

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasBlurred.width = window.innerWidth;
    canvasBlurred.height = window.innerHeight;
    initParticles();
    updateTextRects();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', updateTextRects);

// Create Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--first-color').trim() || 'rgba(255, 255, 255, 0.5)';
        this.baseX = this.x;
        this.baseY = this.y;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Text Repulsion
        textRects.forEach(rect => {
            const dx = this.x - rect.centerX;
            const dy = this.y - rect.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < rect.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (rect.radius - distance) / rect.radius;
                const directionX = forceDirectionX * force * 2; // Gentle push
                const directionY = forceDirectionY * force * 2;

                this.x += directionX;
                this.y += directionY;
            }
        });
    }

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000; // Density
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxBlurred.clearRect(0, 0, canvasBlurred.width, canvasBlurred.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();

        // Draw to both canvases
        particlesArray[i].draw(ctx);
        particlesArray[i].draw(ctxBlurred);

        // Connect to Mouse
        if (mouse.x != null) {
            const dx = particlesArray[i].x - mouse.x;
            const dy = particlesArray[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--first-color').trim() || 'rgba(255, 255, 255, 0.1)';

                // Sharp Layer Only for Mouse Connection (Cleaner look)
                ctx.beginPath();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        // Connect to other particles
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--second-color').trim() || 'rgba(255, 255, 255, 0.1)';

                // Sharp Layer
                ctx.beginPath();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();

                // Blurred Layer
                ctxBlurred.beginPath();
                ctxBlurred.strokeStyle = lineColor;
                ctxBlurred.lineWidth = 0.5;
                ctxBlurred.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctxBlurred.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctxBlurred.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

// Initial setup
resizeCanvas();
updateTextRects();
animateParticles();
