/* Initialize Lenis for Smooth Scrolling */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

/* GSAP Registration */
gsap.registerPlugin(ScrollTrigger);

/* Custom Cursor */
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

let mouse = {
    x: null,
    y: null,
    radius: 200
};

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    mouse.x = posX;
    mouse.y = posY;

    // GSAP for smoother cursor movement
    gsap.to(cursorDot, {
        x: posX,
        y: posY,
        duration: 0.1,
        ease: "power2.out"
    });

    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.5,
        ease: "power2.out"
    });

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

/* GSAP Scroll Reveal Animation */
const revealElements = document.querySelectorAll('p, h1, h2, h3, a.button, .nav__item, .projects__card, .about__info, .contact__content, .footer__list');

revealElements.forEach((el) => {
    gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Trigger when top of element hits 85% of viewport height
                toggleActions: "play none none reverse"
            }
        }
    );
});

/* Text Reveal Animation (Split Text) */
function splitTextToSpans(element) {
    const text = element.innerText;
    element.innerHTML = '';
    const words = text.split(' ');

    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap'; // Prevent word breaking

        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.innerText = char;
            charSpan.style.display = 'inline-block';
            wordSpan.appendChild(charSpan);
        });

        element.appendChild(wordSpan);

        // Add space after word if it's not the last one
        if (index < words.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'char';
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.style.display = 'inline-block';
            element.appendChild(spaceSpan);
        }
    });
}

const textRevealElements = document.querySelectorAll('.home__title, .section__title');

textRevealElements.forEach(el => {
    splitTextToSpans(el);

    gsap.fromTo(el.querySelectorAll('.char'),
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
            }
        }
    );
});

/* Hero Section Entrance */
const heroTl = gsap.timeline();

heroTl.from('.home__subtitle', {
    y: -30,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out"
})
    .from('.home__description', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.5")
    .from('.home__img-wrapper', {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.8");

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

/* 3D Tilt Effect for Cards (GSAP Optimized) */
const cards = document.querySelectorAll('.projects__card');

cards.forEach(card => {
    // Create quickTo setters for performance
    const xTo = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3" });

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        xTo(rotateY);
        yTo(rotateX);

        gsap.to(card, { scale: 1.05, duration: 0.3 });
    });

    card.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
        gsap.to(card, { scale: 1, duration: 0.5 });
    });
});

/* Magnetic Buttons */
const buttons = document.querySelectorAll('.button, .nav__link, .projects__button');

buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3, // Magnetic strength
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
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
    const numberOfParticles = (canvas.width * canvas.height) / 6000; // Density (Increased 15x)
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

            if (distance < 150) {
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

/* Theme Toggle */
const themeButton = document.getElementById('theme-button');
const lightTheme = 'light-theme';

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');

// Check system preference if no local storage
const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

const getCurrentTheme = () => document.body.classList.contains(lightTheme) ? 'light' : 'dark';

// Initialize Theme
if (selectedTheme) {
    document.body.classList[selectedTheme === 'light' ? 'add' : 'remove'](lightTheme);
} else {
    // Apply system preference
    document.body.classList[systemTheme === 'light' ? 'add' : 'remove'](lightTheme);
}

themeButton.addEventListener('click', (event) => {
    // Fallback for browsers that don't support View Transitions
    if (!document.startViewTransition) {
        toggleTheme();
        return;
    }

    // Get click coordinates
    const x = event.clientX;
    const y = event.clientY;

    // Calculate distance to furthest corner
    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );

    // Start the transition
    const transition = document.startViewTransition(() => {
        toggleTheme();
    });

    // Add class to html to disable default page transition
    document.documentElement.classList.add('theme-transition');

    // Wait for the pseudo-elements to be created
    transition.ready.then(() => {
        // Animate the clip-path
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 750, // Slower for more impact
                easing: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)', // "easeInOutCubic" - smooth acceleration and deceleration
                // Specify which pseudo-element to animate
                pseudoElement: '::view-transition-new(root)',
            }
        );
    });

    // Remove class after transition finishes
    transition.finished.then(() => {
        document.documentElement.classList.remove('theme-transition');
    });
});

function toggleTheme() {
    document.body.classList.toggle(lightTheme);
    localStorage.setItem('selected-theme', getCurrentTheme());

    // Update particles color immediately
    if (particlesArray) {
        particlesArray.forEach(p => {
            // Re-fetch color from CSS
            p.color = getComputedStyle(document.documentElement).getPropertyValue('--first-color').trim();
        });
    }
}

/* Mobile Menu Toggle */
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    // Use event delegation or direct attachment with logging
    navClose.addEventListener('click', () => {
        console.log('Close button clicked');
        navMenu.classList.remove('show-menu');
    });
}

// Fallback: Event delegation to ensure it works even if direct attachment fails
document.addEventListener('click', (e) => {
    if (e.target.closest('#nav-close')) {
        console.log('Close button clicked via delegation');
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) navMenu.classList.remove('show-menu');
    }
});

/* Remove Menu Mobile on Link Click */
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));
