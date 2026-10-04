// Main Portfolio Logic & Interactions
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Audio Engine on first interaction
    document.addEventListener('click', () => {
        if (window.dbzAudio) window.dbzAudio.resume();
    }, { once: true });

    // Audio toggle button
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            if (window.dbzAudio) {
                const muted = window.dbzAudio.toggleMute();
                audioToggleBtn.innerHTML = muted ? '🔇 <span class="nav-btn-text">MUTED</span>' : '🔊 <span class="nav-btn-text">KI SOUNDS</span>';
                audioToggleBtn.classList.toggle('muted', muted);
            }
        });
    }

    // 2. Initialize Ki Particle Canvas
    if (window.DBZParticleCanvas) {
        window.particleCanvas = new DBZParticleCanvas('ki-canvas');
    }

    // 3. Initialize Scouter
    if (window.DBZScouter) {
        window.scouter = new DBZScouter();
    }

    // 4. Initialize Dragon Balls Quest
    if (window.DragonBallManager) {
        window.dbManager = new DragonBallManager();
    }

    // 5. Saiyan Form Switcher (Base, SSJ, SSJ Blue, Ultra Instinct)
    const formBtns = document.querySelectorAll('.form-select-btn');
    const formDisplayLabel = document.getElementById('current-form-label');

    formBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const form = btn.getAttribute('data-form');
            setSaiyanForm(form);
        });
    });

    function setSaiyanForm(form) {
        // Remove existing form classes
        document.body.classList.remove('form-base', 'form-ssj', 'form-blue', 'form-ui');
        document.body.classList.add(`form-${form}`);

        // Update active button state
        formBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-form') === form);
        });

        // Update form label
        if (formDisplayLabel) {
            const labels = {
                base: 'BASE FORM',
                ssj: 'SUPER SAIYAN',
                blue: 'SUPER SAIYAN BLUE',
                ui: 'ULTRA INSTINCT'
            };
            formDisplayLabel.textContent = labels[form] || form.toUpperCase();
        }

        // Particle canvas update
        if (window.particleCanvas) {
            window.particleCanvas.setForm(form);
        }

        // Audio trigger
        if (window.dbzAudio) {
            window.dbzAudio.playPowerUp(form);
        }

        // Screen shake ki shockwave
        document.body.classList.add('ki-shockwave');
        setTimeout(() => document.body.classList.remove('ki-shockwave'), 600);
    }

    // Default to Super Saiyan form
    setSaiyanForm('ssj');

    // 6. Typing Effect in Hero
    const typeTarget = document.getElementById('typewriter-text');
    if (typeTarget) {
        const phrases = [
            "Full-Stack Saiyan Engineer",
            "Architect of High-Scale Cloud Systems",
            "Ki-Powered Frontend & Backend Sorcerer",
            "Pushing Code Limits Beyond 9,000!"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];
            if (isDeleting) {
                typeTarget.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typeTarget.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 2200; // Pause at end of sentence
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // 7. Interactive 3D Card Tilt on Project & Skill Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 8. Spirit Bomb Contact Interaction
    const messageInput = document.getElementById('contact-message');
    const spiritBombSphere = document.getElementById('spirit-bomb-ki');
    const spiritChargePercent = document.getElementById('spirit-charge-val');
    const contactForm = document.getElementById('dbz-contact-form');
    const blastOverlay = document.getElementById('kamehameha-blast-overlay');
    const contactModal = document.getElementById('transmission-modal');
    const closeContactModalBtn = document.getElementById('close-transmission-btn');

    if (messageInput && spiritBombSphere) {
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            const maxChars = 200;
            const progress = Math.min(length / maxChars, 1);
            const scale = 1 + progress * 1.8;
            const brightness = 1 + progress * 2.2;

            spiritBombSphere.style.transform = `scale(${scale})`;
            spiritBombSphere.style.filter = `brightness(${brightness}) drop-shadow(0 0 ${20 + progress * 40}px var(--ki-primary))`;

            if (spiritChargePercent) {
                spiritChargePercent.textContent = `${Math.round(progress * 100)}%`;
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Audio blast
            if (window.dbzAudio) window.dbzAudio.playKamehamehaBlast();

            // Fire beam animation
            if (blastOverlay) {
                blastOverlay.classList.remove('hidden');
                blastOverlay.classList.add('fire-blast');
            }

            setTimeout(() => {
                if (blastOverlay) {
                    blastOverlay.classList.remove('fire-blast');
                    blastOverlay.classList.add('hidden');
                }

                // Show confirmation modal
                if (contactModal) {
                    contactModal.classList.remove('hidden');
                    contactModal.classList.add('active');
                }
                contactForm.reset();
                if (spiritBombSphere) spiritBombSphere.style.transform = 'scale(1)';
                if (spiritChargePercent) spiritChargePercent.textContent = '0%';
            }, 900);
        });
    }

    if (closeContactModalBtn && contactModal) {
        closeContactModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
            setTimeout(() => contactModal.classList.add('hidden'), 300);
        });
    }

    // 9. Project Details Modal (Inspect Battle)
    const projectInspectBtns = document.querySelectorAll('.inspect-project-btn');
    const projectModal = document.getElementById('project-modal');
    const closeProjectModalBtn = document.getElementById('close-project-modal-btn');
    const projectModalBody = document.getElementById('project-modal-body');

    const projectData = {
        capsule: {
            title: "Capsule Corp Cloud OS",
            saga: "Saga I: Planetary Infrastructure",
            power: "18,500 PL",
            image: "assets/images/project-capsule.jpg",
            desc: "Next-generation distributed cloud operating system engineered with real-time holographic diagnostics, microservice telemetry, and autonomous load balancing capable of handling planet-scale traffic bursts.",
            tech: ["TypeScript", "Next.js", "Go Microservices", "Kubernetes", "WebSockets", "Redis Cluster"],
            metrics: [
                { label: "Throughput", value: "1.2M Req/sec" },
                { label: "Latency", value: "< 8ms Global" },
                { label: "Uptime", value: "99.999% (Saiyan Tier)" }
            ],
            architecture: "Event-driven reactive streams with distributed Kafka pipelines and Capsule Corp automated circuit breakers.",
            github: "https://github.com",
            demo: "https://example.com"
        },
        chamber: {
            title: "Hyperbolic Time Chamber Simulator",
            saga: "Saga II: Virtual Training Realm",
            power: "24,000 PL",
            image: "assets/images/project-chamber.jpg",
            desc: "Immersive WebGL virtual collaboration environment where 1 day in the real world equals 1 year of accelerated code compilation and algorithm stress-testing in an infinite white void.",
            tech: ["Three.js", "WebGL", "Rust / WASM", "Node.js", "WebRTC Mesh", "Tailored Shaders"],
            metrics: [
                { label: "Compilation Speed", value: "12x Faster via WASM" },
                { label: "Concurrent Warriors", value: "10,000+ Peers" },
                { label: "Frame Rate", value: "Solid 120 FPS" }
            ],
            architecture: "P2P WebRTC data channels with custom client-side physics simulation and serverless reconciliation nodes.",
            github: "https://github.com",
            demo: "https://example.com"
        },
        radar: {
            title: "Global Dragon Radar Navigation",
            saga: "Saga III: Quantum Spatial Platform",
            power: "32,000 PL",
            image: "assets/images/project-radar.jpg",
            desc: "Ultra-precise geospatial tracking platform modeled after Bulma's iconic Dragon Radar. Features real-time quantum electromagnetic frequency scanning and low-latency blip synchronization.",
            tech: ["React", "Mapbox GL", "Python FastAPI", "PostGIS", "GraphQL Subscriptions", "TensorFlow"],
            metrics: [
                { label: "Signal Precision", value: "0.0001 mm Lat/Long" },
                { label: "Sync Latency", value: "12ms" },
                { label: "Coverage", value: "Full Earth + Namek" }
            ],
            architecture: "Dual-satellite triangulation pipeline using PostGIS spatial indexing and predictive AI signal filtering.",
            github: "https://github.com",
            demo: "https://example.com"
        }
    };

    projectInspectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project-id');
            const data = projectData[key];
            if (!data || !projectModal || !projectModalBody) return;

            projectModalBody.innerHTML = `
                <div class="project-modal-grid">
                    <div class="modal-image-wrapper">
                        <img src="${data.image}" alt="${data.title}" class="modal-img">
                        <div class="modal-power-badge">POWER LEVEL: ${data.power}</div>
                    </div>
                    <div class="modal-content-wrapper">
                        <span class="modal-saga-tag">${data.saga}</span>
                        <h2 class="modal-title">${data.title}</h2>
                        <p class="modal-desc">${data.desc}</p>
                        
                        <div class="modal-metrics-grid">
                            ${data.metrics.map(m => `
                                <div class="metric-card">
                                    <div class="metric-val">${m.value}</div>
                                    <div class="metric-label">${m.label}</div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="modal-tech-stack">
                            <h4>TECHNOLOGIES DEPLOYED</h4>
                            <div class="tech-tags">
                                ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                            </div>
                        </div>

                        <div class="modal-actions">
                            <a href="${data.demo}" target="_blank" rel="noopener" class="dbz-btn primary-btn">
                                ⚡ LAUNCH LIVE MISSION
                            </a>
                            <a href="${data.github}" target="_blank" rel="noopener" class="dbz-btn outline-btn">
                                💻 VIEW SOURCE CODE
                            </a>
                        </div>
                    </div>
                </div>
            `;

            if (window.dbzAudio) window.dbzAudio.playInstantTransmission();
            projectModal.classList.remove('hidden');
            projectModal.classList.add('active');
        });
    });

    if (closeProjectModalBtn && projectModal) {
        closeProjectModalBtn.addEventListener('click', () => {
            projectModal.classList.remove('active');
            setTimeout(() => projectModal.classList.add('hidden'), 300);
        });
    }

    // 10. Live Profile Customizer (Saiyan Identity Card)
    const customizerToggle = document.getElementById('open-customizer-btn');
    const customizerDrawer = document.getElementById('customizer-drawer');
    const closeCustomizerBtn = document.getElementById('close-customizer-btn');
    const customizerForm = document.getElementById('customizer-form');

    // Fields
    const nameInput = document.getElementById('custom-name-input');
    const titleInput = document.getElementById('custom-title-input');
    const bioInput = document.getElementById('custom-bio-input');
    const heroNameDisplays = document.querySelectorAll('.dynamic-user-name');
    const bioDisplays = document.querySelectorAll('.dynamic-user-bio');

    // Load saved preferences if any
    const savedName = localStorage.getItem('dbz_user_name');
    const savedTitle = localStorage.getItem('dbz_user_title');
    const savedBio = localStorage.getItem('dbz_user_bio');

    if (savedName) {
        heroNameDisplays.forEach(el => el.textContent = savedName);
        if (nameInput) nameInput.value = savedName;
    }
    if (savedBio && bioDisplays.length > 0) {
        bioDisplays.forEach(el => el.textContent = savedBio);
        if (bioInput) bioInput.value = savedBio;
    }

    if (customizerToggle && customizerDrawer) {
        customizerToggle.addEventListener('click', () => {
            customizerDrawer.classList.toggle('open');
            if (window.dbzAudio) window.dbzAudio.playScouterBeep();
        });
    }

    if (closeCustomizerBtn && customizerDrawer) {
        closeCustomizerBtn.addEventListener('click', () => {
            customizerDrawer.classList.remove('open');
        });
    }

    if (customizerForm) {
        customizerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = nameInput.value.trim() || "GOKU CHEN";
            const newBio = bioInput.value.trim();

            localStorage.setItem('dbz_user_name', newName);
            if (newBio) localStorage.setItem('dbz_user_bio', newBio);

            heroNameDisplays.forEach(el => el.textContent = newName);
            if (newBio) bioDisplays.forEach(el => el.textContent = newBio);

            if (window.dbzAudio) window.dbzAudio.playPowerUp('ssj');
            customizerDrawer.classList.remove('open');
        });
    }

    // 11. Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            const isOpen = navLinks.classList.contains('mobile-open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            if (window.dbzAudio) window.dbzAudio.playKiBurst();
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 12. Instant Transmission Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                e.preventDefault();
                targetElem.scrollIntoView({ behavior: 'smooth' });
                if (window.dbzAudio) window.dbzAudio.playInstantTransmission();
            }
        });
    });
});
