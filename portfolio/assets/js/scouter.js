// Interactive Saiyan Scouter HUD System
class DBZScouter {
    constructor() {
        this.active = false;
        this.color = 'green'; // 'green' or 'red'
        this.scouterOverlay = document.getElementById('scouter-overlay');
        this.reticle = document.getElementById('scouter-reticle');
        this.powerDisplay = document.getElementById('scouter-power-num');
        this.targetNameDisplay = document.getElementById('scouter-target-name');
        this.threatDisplay = document.getElementById('scouter-threat-level');
        this.toggleBtn = document.getElementById('scouter-toggle-btn');
        this.targetX = window.innerWidth / 2;
        this.targetY = window.innerHeight / 2;
        this.currX = this.targetX;
        this.currY = this.targetY;

        this.init();
    }

    init() {
        if (!this.scouterOverlay) return;

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }

        window.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        // Track hoverable targets on page
        this.attachScouterTargets();

        this.updateLoop();
    }

    toggle() {
        this.active = !this.active;
        if (this.active) {
            this.scouterOverlay.classList.remove('hidden');
            if (this.toggleBtn) {
                this.toggleBtn.classList.add('active');
                this.toggleBtn.setAttribute('aria-pressed', 'true');
            }
            if (window.dbzAudio) window.dbzAudio.playScouterBeep();
            this.scanTarget("CORE WARRIOR STATS", 9001, "GOD-TIER");
        } else {
            this.scouterOverlay.classList.add('hidden');
            if (this.toggleBtn) {
                this.toggleBtn.classList.remove('active');
                this.toggleBtn.setAttribute('aria-pressed', 'false');
            }
        }
    }

    switchColor(color) {
        this.color = color;
        this.scouterOverlay.setAttribute('data-color', color);
    }

    attachScouterTargets() {
        // Find elements with data-scouter-target or data-power
        const targets = document.querySelectorAll('[data-scouter-name]');
        targets.forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                if (!this.active) return;
                const name = elem.getAttribute('data-scouter-name') || "UNKNOWN KI";
                const power = parseInt(elem.getAttribute('data-scouter-power') || "1200", 10);
                const threat = elem.getAttribute('data-scouter-threat') || "WARRIOR";

                this.scanTarget(name, power, threat);
                if (window.dbzAudio) {
                    if (power > 9000) {
                        window.dbzAudio.playScouterExplode();
                    } else {
                        window.dbzAudio.playScouterBeep();
                    }
                }
            });
        });
    }

    scanTarget(name, targetPower, threat) {
        if (!this.targetNameDisplay || !this.powerDisplay) return;

        this.targetNameDisplay.textContent = name;
        if (this.threatDisplay) this.threatDisplay.textContent = threat;

        // Number roll up animation
        let current = 0;
        const duration = 400; // ms
        const steps = 15;
        const increment = targetPower / steps;
        let stepCount = 0;

        clearInterval(this.countInterval);
        this.countInterval = setInterval(() => {
            stepCount++;
            current += increment;
            if (stepCount >= steps) {
                current = targetPower;
                clearInterval(this.countInterval);
                if (targetPower > 9000) {
                    this.powerDisplay.innerHTML = `${targetPower.toLocaleString()} <span class="over-9000">OVER 9000!</span>`;
                } else {
                    this.powerDisplay.textContent = Math.round(targetPower).toLocaleString();
                }
            } else {
                this.powerDisplay.textContent = Math.round(current).toLocaleString();
            }
        }, duration / steps);
    }

    updateLoop() {
        if (this.active && this.reticle) {
            // Smooth lerp reticle position
            this.currX += (this.targetX - this.currX) * 0.22;
            this.currY += (this.targetY - this.currY) * 0.22;

            this.reticle.style.transform = `translate3d(${this.currX}px, ${this.currY}px, 0)`;
        }

        requestAnimationFrame(() => this.updateLoop());
    }
}

window.DBZScouter = DBZScouter;
