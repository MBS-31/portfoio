// 7 Dragon Balls Collection Quest & Shenron Wish Summoning System
class DragonBallManager {
    constructor() {
        this.collected = new Set();
        this.totalBalls = 7;
        this.radarCounter = document.getElementById('radar-count');
        this.radarWidget = document.getElementById('dragon-radar-widget');
        this.shenronModal = document.getElementById('shenron-modal');
        this.shenronTriggerBtn = document.getElementById('summon-shenron-btn');
        this.closeModalBtn = document.getElementById('close-shenron-btn');

        this.init();
    }

    init() {
        // Attach click listener to all placed dragon balls
        const balls = document.querySelectorAll('.dragon-ball-item');
        balls.forEach(ball => {
            ball.addEventListener('click', (e) => {
                e.stopPropagation();
                const starCount = parseInt(ball.getAttribute('data-star') || '1', 10);
                this.collectBall(starCount, ball);
            });
        });

        // Summon button
        if (this.shenronTriggerBtn) {
            this.shenronTriggerBtn.addEventListener('click', () => this.summonShenron());
        }

        // Close modal
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeShenronModal());
        }

        // Wish buttons
        const wishButtons = document.querySelectorAll('.wish-btn');
        wishButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const wishType = btn.getAttribute('data-wish');
                this.grantWish(wishType);
            });
        });

        // Quick radar auto-locate button
        const radarLocateBtn = document.getElementById('radar-locate-btn');
        if (radarLocateBtn) {
            radarLocateBtn.addEventListener('click', () => this.findNextBall());
        }

        // Quick auto-collect all cheat button for reviewers/users
        const cheatBtn = document.getElementById('radar-cheat-btn');
        if (cheatBtn) {
            cheatBtn.addEventListener('click', () => this.collectAllCheat());
        }
    }

    collectBall(starNumber, element) {
        if (this.collected.has(starNumber)) return;

        this.collected.add(starNumber);
        if (element) {
            element.classList.add('collected');
            this.createBallSparkles(element);
        }

        // Update radar blips
        const blip = document.querySelector(`.radar-blip[data-star="${starNumber}"]`);
        if (blip) {
            blip.classList.add('found');
        }

        // Sound
        if (window.dbzAudio) window.dbzAudio.playDragonBallCollect();

        this.updateUI();

        // Check if all 7 collected
        if (this.collected.size === this.totalBalls) {
            this.onAllCollected();
        }
    }

    collectAllCheat() {
        for (let i = 1; i <= 7; i++) {
            const ball = document.querySelector(`.dragon-ball-item[data-star="${i}"]`);
            this.collectBall(i, ball);
        }
    }

    findNextBall() {
        for (let i = 1; i <= 7; i++) {
            if (!this.collected.has(i)) {
                const ball = document.querySelector(`.dragon-ball-item[data-star="${i}"]`);
                if (ball) {
                    ball.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    ball.classList.add('pulse-highlight');
                    setTimeout(() => ball.classList.remove('pulse-highlight'), 2500);
                    if (window.dbzAudio) window.dbzAudio.playScouterBeep();
                }
                return;
            }
        }
    }

    createBallSparkles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 12; i++) {
            const spark = document.createElement('div');
            spark.className = 'db-sparkle';
            spark.style.left = `${rect.left + rect.width / 2}px`;
            spark.style.top = `${rect.top + rect.height / 2}px`;
            const angle = (Math.PI * 2 / 12) * i;
            const dist = 45;
            spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            spark.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
            document.body.appendChild(spark);

            setTimeout(() => spark.remove(), 700);
        }
    }

    updateUI() {
        if (this.radarCounter) {
            this.radarCounter.textContent = `${this.collected.size}/${this.totalBalls}`;
        }
    }

    onAllCollected() {
        if (this.shenronTriggerBtn) {
            this.shenronTriggerBtn.classList.remove('hidden');
            this.shenronTriggerBtn.classList.add('ready-pulse');
        }

        // Show instant summoning prompt banner
        const banner = document.getElementById('all-balls-banner');
        if (banner) {
            banner.classList.remove('hidden');
            setTimeout(() => {
                banner.classList.add('show');
            }, 50);
        }
    }

    summonShenron() {
        if (window.dbzAudio) window.dbzAudio.playShenronRoar();

        // Sky flash effect
        const flash = document.createElement('div');
        flash.className = 'shenron-sky-flash';
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.remove();
            if (this.shenronModal) {
                this.shenronModal.classList.remove('hidden');
                this.shenronModal.classList.add('active');
            }
        }, 600);
    }

    closeShenronModal() {
        if (this.shenronModal) {
            this.shenronModal.classList.remove('active');
            setTimeout(() => {
                this.shenronModal.classList.add('hidden');
            }, 300);
        }
    }

    grantWish(type) {
        if (window.dbzAudio) window.dbzAudio.playPowerUp('ui');

        const resultBox = document.getElementById('wish-granted-message');
        const wishButtons = document.getElementById('wish-buttons-container');

        if (type === 'resume') {
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="wish-success">
                        <span class="dragon-icon">🐉</span>
                        <h3>YOUR WISH HAS BEEN GRANTED!</h3>
                        <p>The Legendary Saiyan Resume scroll is revealed below. You may download or inspect your warrior credentials!</p>
                        <a href="#resume-section" class="dbz-btn primary-btn view-resume-btn" onclick="document.getElementById('close-shenron-btn').click();">
                            📜 VIEW SAIYAN SCROLL
                        </a>
                    </div>
                `;
            }
        } else if (type === 'overdrive') {
            if (window.particleCanvas) {
                window.particleCanvas.setOverdrive(true);
            }
            document.body.classList.add('overdrive-mode');
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="wish-success">
                        <span class="dragon-icon">⚡</span>
                        <h3>MAX KI OVERDRIVE UNLEASHED!</h3>
                        <p>Divine lightning arcs now surge across your screen! Your power level has surpassed mortal limits!</p>
                    </div>
                `;
            }
        } else if (type === 'contact') {
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="wish-success">
                        <span class="dragon-icon">💥</span>
                        <h3>DIRECT KI TRANSMISSION CHANNEL OPEN!</h3>
                        <p>Capsule Corp long-range telepathic channel activated. Scroll to the contact chamber to broadcast your message!</p>
                        <a href="#contact" class="dbz-btn primary-btn" onclick="document.getElementById('close-shenron-btn').click();">
                            🚀 GO TO CONTACT CHAMBER
                        </a>
                    </div>
                `;
            }
            const contactInput = document.getElementById('contact-subject');
            if (contactInput) contactInput.value = "[SHENRON SUMMON PRIORITY TRANSMISSION]";
        }

        if (wishButtons) wishButtons.classList.add('hidden');
        if (resultBox) resultBox.classList.remove('hidden');
    }
}

window.DragonBallManager = DragonBallManager;
