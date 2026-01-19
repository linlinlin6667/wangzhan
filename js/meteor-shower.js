/**
 * Dynamic Space Background System
 * Creates an immersive space environment with meteors, stars, nebulae, and cosmic effects
 */

class SpaceBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            // Star field options
            starCount: options.starCount || 200,
            starMinSize: options.starMinSize || 1,
            starMaxSize: options.starMaxSize || 3,
            starTwinkleSpeed: options.starTwinkleSpeed || 2,

            // Meteor options
            meteorCount: options.meteorCount || 15,
            meteorMinSpeed: options.meteorMinSpeed || 8,
            meteorMaxSpeed: options.meteorMaxSpeed || 20,
            meteorMinSize: options.meteorMinSize || 3,
            meteorMaxSize: options.meteorMaxSize || 6,
            meteorTrailLength: options.meteorTrailLength || 200,
            meteorColors: options.meteorColors || ['#00F0FF', '#7B61FF', '#FF00E6', '#00FF94', '#FFD700'],
            meteorSpawnInterval: options.meteorSpawnInterval || 300,

            // Cosmic dust options
            dustCount: options.dustCount || 50,
            dustMinSize: options.dustMinSize || 2,
            dustMaxSize: options.dustMaxSize || 4,

            // Performance
            reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };

        this.elements = {
            nebulaLayer1: null,
            nebulaLayer2: null,
            starField: null,
            meteorShower: null,
            aurora: null,
            cosmicDust: null,
            glowOrb1: null,
            glowOrb2: null,
            glowOrb3: null
        };

        this.meteors = [];
        this.stars = [];
        this.dustParticles = [];
        this.isActive = true;
        this.animationId = null;
        this.lastMeteorSpawn = 0;

        this.init();
    }

    init() {
        if (this.options.reduceMotion) {
            console.log('Reduced motion enabled, creating simplified background');
            this.createSimplifiedBackground();
        } else {
            this.createFullBackground();
        }
        this.startAnimation();
        window.addEventListener('resize', () => this.handleResize());
    }

    createFullBackground() {
        this.createNebulaLayers();
        this.createStarField();
        this.createMeteorShower();
        this.createAurora();
        this.createCosmicDust();
        this.createGlowOrbs();
    }

    createSimplifiedBackground() {
        this.createStarField();
        this.createMeteorShower();
    }

    createNebulaLayers() {
        // Layer 1
        this.elements.nebulaLayer1 = document.createElement('div');
        this.elements.nebulaLayer1.className = 'nebula-layer nebula-layer-1';
        this.container.appendChild(this.elements.nebulaLayer1);

        // Layer 2
        this.elements.nebulaLayer2 = document.createElement('div');
        this.elements.nebulaLayer2.className = 'nebula-layer nebula-layer-2';
        this.container.appendChild(this.elements.nebulaLayer2);
    }

    createStarField() {
        this.elements.starField = document.createElement('div');
        this.elements.starField.className = 'star-field';
        this.container.appendChild(this.elements.starField);

        for (let i = 0; i < this.options.starCount; i++) {
            this.createStar();
        }
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'star';

        const size = this.randomBetween(this.options.starMinSize, this.options.starMaxSize);
        const x = this.randomBetween(0, 100);
        const y = this.randomBetween(0, 100);
        const twinkleDuration = this.randomBetween(2, 5);
        const twinkleDelay = this.randomBetween(0, 5);
        const twinkleMin = this.randomBetween(0.3, 0.7);
        const twinkleMax = this.randomBetween(0.8, 1);

        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            --twinkle-duration: ${twinkleDuration}s;
            --twinkle-delay: ${twinkleDelay}s;
            --twinkle-min: ${twinkleMin};
            --twinkle-max: ${twinkleMax};
        `;

        this.elements.starField.appendChild(star);
        this.stars.push(star);
    }

    createMeteorShower() {
        this.elements.meteorShower = document.createElement('div');
        this.elements.meteorShower.className = 'meteor-shower-container';
        this.container.appendChild(this.elements.meteorShower);
    }

    createMeteor() {
        if (this.meteors.length >= this.options.meteorCount) return;

        const meteorContainer = document.createElement('div');
        meteorContainer.className = 'meteor-container';
        meteorContainer.style.cssText = `
            position: absolute;
            pointer-events: none;
            will-change: transform, opacity;
        `;

        // Meteor head
        const meteor = document.createElement('div');
        meteor.className = 'meteor';

        // Meteor trail
        const trail = document.createElement('div');
        trail.className = 'meteor-trail';

        // Meteor glow
        const glow = document.createElement('div');
        glow.className = 'meteor-glow';

        const size = this.randomBetween(this.options.meteorMinSize, this.options.meteorMaxSize);
        const speed = this.randomBetween(this.options.meteorMinSpeed, this.options.meteorMaxSpeed);
        const color = this.options.meteorColors[Math.floor(Math.random() * this.options.meteorColors.length)];
        const trailLength = this.randomBetween(150, this.options.meteorTrailLength);
        const trailWidth = size * 0.5;
        const glowSize = size * 3;
        const angle = this.randomBetween(30, 60);

        meteor.style.cssText = `
            --meteor-size: ${size}px;
            --meteor-color: ${color};
            --glow-size: ${glowSize}px;
        `;

        trail.style.cssText = `
            --trail-length: ${trailLength}px;
            --trail-width: ${trailWidth}px;
            --trail-angle: ${angle}deg;
            --meteor-color: ${color};
        `;

        glow.style.cssText = `
            --trail-length: ${trailLength}px;
            --trail-width: ${trailWidth}px;
            --trail-angle: ${angle}deg;
            --meteor-color: ${color};
        `;

        meteorContainer.appendChild(glow);
        meteorContainer.appendChild(trail);
        meteorContainer.appendChild(meteor);

        this.elements.meteorShower.appendChild(meteorContainer);

        // Calculate start and end positions
        const startX = this.randomBetween(-200, window.innerWidth + 200);
        const startY = -100;
        const endX = startX + Math.cos(angle * Math.PI / 180) * (window.innerHeight + 200);
        const endY = window.innerHeight + 100;

        const meteorData = {
            container: meteorContainer,
            meteor: meteor,
            trail: trail,
            glow: glow,
            x: startX,
            y: startY,
            speed: speed,
            angle: angle,
            color: color,
            opacity: 0,
            fadeIn: true,
            fadeOut: false,
            progress: 0
        };

        this.meteors.push(meteorData);
    }

    updateMeteors(deltaTime) {
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];

            const radians = meteor.angle * Math.PI / 180;
            const moveDistance = meteor.speed * (deltaTime / 16);

            meteor.x += Math.cos(radians) * moveDistance;
            meteor.y += Math.sin(radians) * moveDistance;
            meteor.progress += moveDistance;

            // Fade in
            if (meteor.fadeIn) {
                meteor.opacity += 0.05;
                if (meteor.opacity >= 1) {
                    meteor.opacity = 1;
                    meteor.fadeIn = false;
                }
            }

            // Fade out when near bottom
            if (meteor.y > window.innerHeight * 0.75 && !meteor.fadeOut) {
                meteor.fadeOut = true;
            }

            // Fade out
            if (meteor.fadeOut) {
                meteor.opacity -= 0.02;
                if (meteor.opacity <= 0) {
                    meteor.opacity = 0;
                    this.removeMeteor(i);
                    continue;
                }
            }

            // Update positions
            meteor.container.style.transform = `translate(${meteor.x}px, ${meteor.y}px)`;
            meteor.meteor.style.opacity = meteor.opacity;
            meteor.trail.style.opacity = meteor.opacity * 0.8;
            meteor.glow.style.opacity = meteor.opacity * 0.4;

            // Remove if out of bounds
            if (meteor.y > window.innerHeight + 200 || meteor.x < -300 || meteor.x > window.innerWidth + 300) {
                this.removeMeteor(i);
            }
        }
    }

    removeMeteor(index) {
        const meteor = this.meteors[index];
        if (meteor && meteor.container) {
            meteor.container.remove();
        }
        this.meteors.splice(index, 1);
    }

    createAurora() {
        this.elements.aurora = document.createElement('div');
        this.elements.aurora.className = 'aurora';
        this.container.appendChild(this.elements.aurora);
    }

    createCosmicDust() {
        this.elements.cosmicDust = document.createElement('div');
        this.elements.cosmicDust.className = 'cosmic-dust';
        this.container.appendChild(this.elements.cosmicDust);

        for (let i = 0; i < this.options.dustCount; i++) {
            this.createDustParticle();
        }
    }

    createDustParticle() {
        const dust = document.createElement('div');
        dust.className = 'dust-particle';

        const size = this.randomBetween(this.options.dustMinSize, this.options.dustMaxSize);
        const x = this.randomBetween(0, 100);
        const y = this.randomBetween(0, 100);
        const duration = this.randomBetween(10, 20);
        const delay = this.randomBetween(0, 10);
        const dustX = this.randomBetween(-50, 50);
        const dustY = this.randomBetween(-50, 50);

        dust.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            --dust-duration: ${duration}s;
            --dust-delay: ${delay}s;
            --dust-x: ${dustX}px;
            --dust-y: ${dustY}px;
        `;

        this.elements.cosmicDust.appendChild(dust);
        this.dustParticles.push(dust);
    }

    createGlowOrbs() {
        // Orb 1 - Cyan
        this.elements.glowOrb1 = document.createElement('div');
        this.elements.glowOrb1.className = 'glow-orb glow-orb-1';
        this.container.appendChild(this.elements.glowOrb1);

        // Orb 2 - Purple
        this.elements.glowOrb2 = document.createElement('div');
        this.elements.glowOrb2.className = 'glow-orb glow-orb-2';
        this.container.appendChild(this.elements.glowOrb2);

        // Orb 3 - Magenta
        this.elements.glowOrb3 = document.createElement('div');
        this.elements.glowOrb3.className = 'glow-orb glow-orb-3';
        this.container.appendChild(this.elements.glowOrb3);
    }

    startAnimation() {
        let lastTime = performance.now();

        const animate = (currentTime) => {
            if (!this.isActive) return;

            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Spawn meteors
            if (currentTime - this.lastMeteorSpawn > this.options.meteorSpawnInterval) {
                this.createMeteor();
                this.lastMeteorSpawn = currentTime;
            }

            // Update meteors
            this.updateMeteors(deltaTime);

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.clearAll();
    }

    clearAll() {
        this.meteors.forEach(meteor => {
            if (meteor.container) {
                meteor.container.remove();
            }
        });
        this.meteors = [];

        this.stars.forEach(star => {
            star.remove();
        });
        this.stars = [];

        this.dustParticles.forEach(dust => {
            dust.remove();
        });
        this.dustParticles = [];

        Object.values(this.elements).forEach(element => {
            if (element) {
                element.remove();
            }
        });
    }

    handleResize() {
        // Clear and recreate stars on resize
        if (this.elements.starField) {
            this.stars.forEach(star => star.remove());
            this.stars = [];
            for (let i = 0; i < this.options.starCount; i++) {
                this.createStar();
            }
        }
    }

    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }
}

/**
 * Initialize Space Background
 */
document.addEventListener('DOMContentLoaded', function() {
    if (document.body) {
        window.spaceBackground = new SpaceBackground(document.body, {
            starCount: 200,
            meteorCount: 15,
            meteorMinSpeed: 8,
            meteorMaxSpeed: 20,
            meteorColors: ['#00F0FF', '#7B61FF', '#FF00E6', '#00FF94', '#FFD700'],
            meteorSpawnInterval: 300,
            dustCount: 50
        });
        console.log('Space background initialized');
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpaceBackground;
}
