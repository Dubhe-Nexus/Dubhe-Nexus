// Copyright (c) 2026 Dubhe Nexus Innovation and Research Studio
// Licensed under DNL ATT-NC-SL

let isNavScrolling = false;

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-img');
    const state = new Map();

    parallaxElements.forEach(el => {
        state.set(el, {
            current: 0,
            velocity: 0,
            target: 0
        });
    });

    const stiffness = 0.06;
    const damping = 0.75;

    function updateParallax() {
        if (isNavScrolling) {
            requestAnimationFrame(updateParallax);
            return;
        }

        const windowHeight = window.innerHeight;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.15;
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const s = state.get(el);

            s.target = (centerY - viewportCenter) * speed;

            const springForce = (s.target - s.current) * stiffness;
            s.velocity += springForce;
            s.velocity *= damping;
            s.current += s.velocity;

            if (Math.abs(s.velocity) < 0.01 && Math.abs(s.target - s.current) < 0.1) {
                s.current = s.target;
                s.velocity = 0;
            }

            el.style.transform = `translateY(${s.current}px)`;
        });

        requestAnimationFrame(updateParallax);
    }

    requestAnimationFrame(updateParallax);
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    animatedElements.forEach(el => observer.observe(el));

    animatedElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
            el.classList.add('revealed');
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === "#" || href === "") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target);
            }
        });
    });
}

function smoothScrollTo(target) {
    const targetY = target.getBoundingClientRect().top + window.scrollY - 80;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 800; // ms
    let startTime = null;

    isNavScrolling = true;

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            setTimeout(() => {
                isNavScrolling = false;
            }, 50);
        }
    }

    requestAnimationFrame(step);
}

function initImageReveal() {
    const images = document.querySelectorAll('.img-frame img, .hero-image');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                imageObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(1.05)';
        img.style.transition = 'opacity 1s cubic-bezier(0.2, 0.9, 0.3, 1), transform 1s cubic-bezier(0.2, 0.9, 0.3, 1)';
        imageObserver.observe(img);
    });

    images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }
    });
}

function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (!hamburger || !mobileNav || !mobileOverlay) return;

    function openMenu() {
        hamburger.classList.add('active');
        mobileNav.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileOverlay.addEventListener('click', closeMenu);

    mobileNav.querySelectorAll('.mobile-parent').forEach(parent => {
        const arrow = parent.querySelector('.mobile-arrow');
        if (arrow) {
            arrow.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                parent.classList.toggle('open');
            });
        }
        if (parent.tagName !== 'A') {
            parent.addEventListener('click', () => {
                parent.classList.toggle('open');
            });
        }
    });

    mobileNav.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 150);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            closeMenu();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initScrollAnimations();
    initSmoothScroll();
    initImageReveal();
    initMobileNav();
});
