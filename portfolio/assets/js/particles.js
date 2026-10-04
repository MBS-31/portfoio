// Ki Energy & Aura Particle Canvas System
class DBZParticleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.sparks = [];
        this.lightningBolts = [];
        this.maxParticles = 65;
        this.currentForm = 'ssj'; // 'base', 'ssj', 'blue', 'ui'
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.isOverdrive = false;

        this.palettes = {
            base: {
                primary: 'rgba(255, 120, 20, ',
                secondary: 'rgba(255, 60, 0, ',
                spark: 'rgba(255, 200, 100, ',
                auraGlow: 'rgba(255, 90, 0, 0.15)'
            },
            ssj: {
                primary: 'rgba(255, 215, 0, ',
                secondary: 'rgba(255, 170, 0, ',
                spark: 'rgba(120, 240, 255, ',
                auraGlow: 'rgba(255, 200, 0, 0.2)'
            },
            blue: {
                primary: 'rgba(0, 210, 255, ',
                secondary: 'rgba(0, 120, 255, ',
                spark: 'rgba(180, 255, 255, ',
                auraGlow: 'rgba(0, 180, 255, 0.22)'
            },
            ui: {
                primary: 'rgba(240, 245, 255, ',
                secondary: 'rgba(190, 160, 255, ',
                spark: 'rgba(255, 255, 255, ',
                auraGlow: 'rgba(200, 180, 255, 0.25)'
            }
        };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Initialize particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setForm(form) {
        if (this.palettes[form]) {
            this.currentForm = form;
            this.triggerFormBurst();
        }
    }

    setOverdrive(state) {
        this.isOverdrive = state;
        this.maxParticles = state ? 130 : 65;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + Math.random() * 50,
            size: Math.random() * 4 + 1.5,
            speedY: Math.random() * 2.5 + 1.2,
            speedX: (Math.random() - 0.5) * 1.5,
            opacity: Math.random() * 0.7 + 0.3,
            life: Math.random() * 120 + 80,
            maxLife: 160,
            type: Math.random() > 0.35 ? 'ki' : 'spark'
        };
    }

    triggerFormBurst() {
        // Burst of particles from center
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            this.particles.push({
                x: cx,
                y: cy,
                size: Math.random() * 5 + 2,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                opacity: 1,
                life: 60,
                maxLife: 60,
                type: 'spark'
            });
        }

        // Add electric arc
        this.spawnLightning();
    }

    spawnLightning() {
        const x1 = Math.random() * this.canvas.width;
        const y1 = Math.random() * (this.canvas.height * 0.4);
        const x2 = x1 + (Math.random() - 0.5) * 300;
        const y2 = y1 + Math.random() * 300 + 100;

        const points = [{ x: x1, y: y1 }];
        const segments = 6;
        for (let i = 1; i < segments; i++) {
            const ratio = i / segments;
            points.push({
                x: x1 + (x2 - x1) * ratio + (Math.random() - 0.5) * 60,
                y: y1 + (y2 - y1) * ratio + (Math.random() - 0.5) * 40
            });
        }
        points.push({ x: x2, y: y2 });

        this.lightningBolts.push({
            points: points,
            life: 12,
            maxLife: 12,
            color: this.currentForm === 'ssj' ? '#7df9ff' : (this.currentForm === 'blue' ? '#ffffff' : '#ffd700')
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const palette = this.palettes[this.currentForm];

        // Draw ambient aura glow near bottom
        const grad = this.ctx.createLinearGradient(0, this.canvas.height, 0, this.canvas.height - 350);
        grad.addColorStop(0, palette.auraGlow);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, this.canvas.height - 350, this.canvas.width, 350);

        // Update & Render Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y -= p.speedY;
            p.life--;

            // Repulsion/attraction slightly near cursor
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
                p.x += (dx / dist) * 2;
                p.y += (dy / dist) * 2;
            }

            const currentAlpha = (p.life / p.maxLife) * p.opacity;

            if (p.type === 'ki') {
                // Glowing Ki orb with soft halo
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = palette.primary + currentAlpha + ')';
                this.ctx.shadowBlur = p.size * 3;
                this.ctx.shadowColor = palette.primary + '1)';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            } else {
                // Sharp electric spark
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
                this.ctx.fillStyle = palette.spark + currentAlpha + ')';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = palette.spark + '1)';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }

            // Reset or remove
            if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > this.canvas.width + 20) {
                if (this.particles.length > this.maxParticles) {
                    this.particles.splice(i, 1);
                } else {
                    this.particles[i] = this.createParticle();
                }
            }
        }

        // Randomly spawn lightning arcs for SSJ / Overdrive
        if (Math.random() < (this.isOverdrive ? 0.08 : 0.02) && (this.currentForm === 'ssj' || this.currentForm === 'blue' || this.isOverdrive)) {
            this.spawnLightning();
        }

        // Render Lightning Bolts
        for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
            const bolt = this.lightningBolts[i];
            bolt.life--;

            const alpha = bolt.life / bolt.maxLife;
            this.ctx.beginPath();
            this.ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
            for (let j = 1; j < bolt.points.length; j++) {
                this.ctx.lineTo(bolt.points[j].x, bolt.points[j].y);
            }
            this.ctx.strokeStyle = bolt.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.lineWidth = Math.random() * 2.5 + 1.2;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = bolt.color;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;

            if (bolt.life <= 0) {
                this.lightningBolts.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

window.DBZParticleCanvas = DBZParticleCanvas;
