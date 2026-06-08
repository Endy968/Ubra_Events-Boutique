/* ============================================================
   UBRA EVENTS & BOUTIQUE — Main Script
   main.js
   ============================================================ */

/* ══════════════════════════════════════
   NAVBAR — shrink on scroll
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ══════════════════════════════════════
   MOBILE HAMBURGER MENU
══════════════════════════════════════ */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4'
).forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════
   ANIMATED PARTICLE BACKGROUND (Canvas)
══════════════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x          = Math.random() * W;
    this.y          = Math.random() * H;
    this.r          = Math.random() * 1.4 + 0.2;
    this.vx         = (Math.random() - 0.5) * 0.28;
    this.vy         = (Math.random() - 0.5) * 0.28;
    this.alpha      = Math.random() * 0.4 + 0.05;
    this.pulse      = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.007 + Math.random() * 0.012;
  }
  update() {
    this.x     += this.vx;
    this.y     += this.vy;
    this.pulse += this.pulseSpeed;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    const a = this.alpha * (0.55 + 0.45 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${a})`;
    ctx.fill();
  }
}

for (let i = 0; i < 130; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 95) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201,168,76,${0.07 * (1 - dist / 95)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

// Mouse-attract effect
let mouse = { x: W / 2, y: H / 2 };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    // Subtle attract toward cursor
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      p.vx += (dx / dist) * 0.008;
      p.vy += (dy / dist) * 0.008;
      // Dampen
      p.vx *= 0.97;
      p.vy *= 0.97;
    }
    p.update(); p.draw();
  });
  drawLines();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ══════════════════════════════════════
   CURSOR GLOW TRAIL
══════════════════════════════════════ */
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position:fixed; pointer-events:none; z-index:9998;
  width:300px; height:300px; border-radius:50%;
  background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
  transform: translate(-50%,-50%);
  transition: left 0.12s ease, top 0.12s ease;
  will-change: left, top;
`;
document.body.appendChild(cursorGlow);
window.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* ══════════════════════════════════════
   3D TILT — package cards & service items
══════════════════════════════════════ */
function addTilt(selector, intensity = 8) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      el.style.transform = `perspective(800px) rotateY(${dx * intensity}deg) rotateX(${-dy * intensity}deg) translateY(-6px) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s ease';
    });
  });
}
addTilt('.service-item', 6);
addTilt('.package-card', 5);

/* ══════════════════════════════════════
   RIPPLE EFFECT — social buttons
══════════════════════════════════════ */
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = this.querySelector('.social-ripple');
    const rect   = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    this.classList.remove('rippling');
    void this.offsetWidth; // reflow
    this.classList.add('rippling');
    setTimeout(() => this.classList.remove('rippling'), 700);
  });
});

/* ══════════════════════════════════════
   MAGNETIC HOVER — social buttons
   Buttons subtly follow the cursor within their bounds
══════════════════════════════════════ */
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.12;
    const dy   = (e.clientY - cy) * 0.12;
    btn.style.transform = `translate(${dx}px, ${dy - 6}px) scale(1.02)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.15s ease';
  });
});

/* ══════════════════════════════════════
   FLOATING PETALS
══════════════════════════════════════ */
function spawnPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  const size = 4 + Math.random() * 8;
  petal.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    top:-10px;
    animation-duration:${8 + Math.random() * 10}s;
    animation-delay:${Math.random() * 2}s;
    opacity:0;
    border-radius:${Math.random() > 0.5 ? '50% 0 50% 0' : '50%'};
    position:fixed; pointer-events:none; z-index:9997;
    background:rgba(201,168,76,0.6);
    animation-name:petalFall;
    animation-timing-function:linear;
    animation-fill-mode:forwards;
  `;
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 22000);
}
setInterval(spawnPetal, 1400);

/* ══════════════════════════════════════
   COUNTER ANIMATION — Why Us stat
══════════════════════════════════════ */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statEl = document.querySelector('.why-stat-num');
if (statEl) {
  const statObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      statEl.style.animation = 'countPop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards';
      animateCounter(statEl, 100, '%');
      statObs.disconnect();
    }
  }, { threshold: 0.5 });
  statObs.observe(statEl);
}

/* ══════════════════════════════════════
   STAGGERED PACKAGE CARD ENTRANCE
══════════════════════════════════════ */
const packageObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 120);
      packageObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.package-card').forEach(c => packageObs.observe(c));

/* ══════════════════════════════════════
   HERO TITLE TYPING EFFECT (subtle)
   Adds a blinking cursor after the subtitle
══════════════════════════════════════ */
window.addEventListener('load', () => {
  const sub = document.querySelector('.hero-sub');
  if (sub) {
    const cursor = document.createElement('span');
    cursor.style.cssText = `
      display:inline-block; width:2px; height:0.9em;
      background:rgba(201,168,76,0.7); margin-left:3px;
      vertical-align:middle;
      animation:blink 1.1s step-end infinite;
    `;
    setTimeout(() => {
      sub.appendChild(cursor);
      setTimeout(() => cursor.remove(), 4000);
    }, 2800);
  }
});

/* ══════════════════════════════════════
   GALLERY — Parallax on scroll
══════════════════════════════════════ */
const galleryCells = document.querySelectorAll('.gallery-cell img');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  galleryCells.forEach((img, i) => {
    const offset = (scrollY * (0.04 + i * 0.01));
    img.style.transform = `translateY(${offset}px) scale(1.08)`;
  });
}, { passive: true });

