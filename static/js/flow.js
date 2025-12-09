/**
 * FLOW STATE VISUALIZER
 * Generates a rhythmic sine-wave / particle system representing "Flow".
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

let width, height;
let particles = [];
const PARTICLE_COUNT = 100;
let time = 0;

// Mouse State
let mouse = { x: 0, y: 0 };
let targetParams = { freq: 0.01, amp: 50 };
let currentParams = { freq: 0.01, amp: 50 };

// Resize handling
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Map mouse to params
    targetParams.freq = 0.005 + (mouse.x / width) * 0.05;
    targetParams.amp = 20 + (mouse.y / height) * 150;
});

class Particle {
    constructor(id) {
        this.id = id;
        this.x = (width / PARTICLE_COUNT) * id;
        this.y = height / 2;
        this.baseY = height / 2;
        this.size = Math.random() * 2 + 1;
        this.speed = 0.05 + Math.random() * 0.05;
        this.offset = id * 0.1;
    }

    update() {
        // Lerp params
        currentParams.freq += (targetParams.freq - currentParams.freq) * 0.1;
        currentParams.amp += (targetParams.amp - currentParams.amp) * 0.1;

        // Sine wave movement (Flow)
        this.y = this.baseY + Math.sin(time * currentParams.freq + this.offset) * currentParams.amp;

        // Add some noise/jitter for "robotic" feel
        if (Math.random() > 0.95) {
            this.y += (Math.random() - 0.5) * 10;
        }

        // Draw connections
        if (this.id > 0) {
            const prev = particles[this.id - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 + (this.y / height) * 0.5})`; // Electric Blue
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(i));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Trails
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw scanning line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.stroke();

    time += 2; // Speed of time
    requestAnimationFrame(animate);
}

resize();
initParticles();
animate();
