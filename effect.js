// © 2026 Dubhe Nexus Innovation and Research Studio
// Licensed under MIT License

// 滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 粒子交互
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = -1000, mouseY = -1000;
    let realMouseX = -500, realMouseY = -500;
    let particles = [];

    function resizeCanvas() {
        const container = canvas.parentElement;
        if (!container) return;
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
    }

    function initParticles() {
        particles = [];
        const count = Math.min(110, Math.floor(Math.max(50, window.innerWidth / 16)));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                radius: 1.4 + Math.random() * 1,
            });
        }
    }

    window.addEventListener('mousemove', (e) => {
        realMouseX = e.clientX;
        realMouseY = e.clientY;
    });

    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            mouseX = realMouseX - rect.left;
            mouseY = realMouseY - rect.top;
        }

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            p.x = Math.min(Math.max(p.x, 0), width);
            p.y = Math.min(Math.max(p.y, 0), height);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#4a4a4a';
            ctx.fill();

            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 260 && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouseX, mouseY);
                const opacity = 0.45 * (1 - dist / 260);
                ctx.strokeStyle = `rgba(55, 55, 55, ${opacity})`;
                ctx.lineWidth = 1.0;
                ctx.stroke();
            }
        }
        requestAnimationFrame(animateParticles);
    }

    function handleResize() {
        resizeCanvas();
        initParticles();
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    animateParticles();
}

// 动画
const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

animatedElements.forEach(el => observer.observe(el));

animatedElements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
        el.classList.add('revealed');
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === "#" || href === "") return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});