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
            starTwinkleSpeed: options.starTwinkleSpeed || 3,

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

        this.elements = {};
        this.meteors = [];
        this.stars = [];
        this.dustParticles = [];
        this.isActive = true;
        this.lastSpawnTime = 0;

        this.init();
    }

    init() {
        this.createSpaceBackground();
        this.createNebulae();
        this.createAurora();
        this.createGlowOrbs();
        this.createStarField();
        this.createMeteorShower();
        this.createCosmicDust();
        this.startAnimation();
    }

    createSpaceBackground() {
        const bg = document.createElement('div');
        bg.className = 'space-background';
        this.container.appendChild(bg);
        this.elements.spaceBackground = bg;
    }

    createNebulae() {
        const nebulaContainer = document.createElement('div');
        nebulaContainer.className = 'nebula-container';
        nebulaContainer.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden;';
        
        for (let i = 1; i <= 3; i++) {
            const nebula = document.createElement('div');
            nebula.className = `nebula nebula-${i}`;
            nebulaContainer.appendChild(nebula);
        }
        
        this.container.appendChild(nebulaContainer);
        this.elements.nebulaContainer = nebulaContainer;
    }

    createAurora() {
        const aurora = document.createElement('div');
        aurora.className = 'aurora';
        this.container.appendChild(aurora);
        this.elements.aurora = aurora;
    }

    createGlowOrbs() {
        const orbContainer = document.createElement('div');
        orbContainer.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden;';
        
        for (let i = 1; i <= 3; i++) {
            const orb = document.createElement('div');
            orb.className = `glow-orb glow-orb-${i}`;
            orbContainer.appendChild(orb);
        }
        
        this.container.appendChild(orbContainer);
        this.elements.glowOrbContainer = orbContainer;
    }

    createStarField() {
        const starField = document.createElement('div');
        starField.className = 'star-field';
        
        for (let i = 0; i < this.options.starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = this.randomBetween(this.options.starMinSize, this.options.starMaxSize);
            const x = this.randomBetween(0, 100);
            const y = this.randomBetween(0, 100);
            const twinkleDuration = this.randomBetween(2, 5);
            const twinkleDelay = this.randomBetween(0, 5);
            
            star.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                --twinkle-duration: ${twinkleDuration}s;
                --twinkle-delay: ${twinkleDelay}s;
            `;
            
            starField.appendChild(star);
            this.stars.push(star);
        }
        
        this.container.appendChild(starField);
        this.elements.starField = starField;
    }

    createMeteorShower() {
        const meteorShower = document.createElement('div');
        meteorShower.className = 'meteor-shower';
        this.container.appendChild(meteorShower);
        this.elements.meteorShower = meteorShower;
    }

    createMeteor() {
        if (this.meteors.length >= this.options.meteorCount || this.options.reduceMotion) return;

        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        const size = this.randomBetween(this.options.meteorMinSize, this.options.meteorMaxSize);
        const startX = this.randomBetween(0, window.innerWidth);
        const speed = this.randomBetween(this.options.meteorMinSpeed, this.options.meteorMaxSpeed);
        const color = this.options.meteorColors[Math.floor(Math.random() * this.options.meteorColors.length)];
        const angle = this.randomBetween(30, 60);
        const trailLength = this.randomBetween(100, this.options.meteorTrailLength);
        
        const head = document.createElement('div');
        head.className = 'meteor-head';
        head.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            color: ${color};
        `;
        
        const trail = document.createElement('div');
        trail.className = 'meteor-trail';
        trail.style.cssText = `
            width: ${trailLength}px;
            height: ${size * 0.6}px;
            background: linear-gradient(90deg, ${color}, transparent);
            transform-origin: left center;
            transform: rotate(${angle}deg);
        `;
        
        const glow = document.createElement('div');
        glow.className = 'meteor-glow';
        glow.style.cssText = `
            width: ${size * 3}px;
            height: ${size * 3}px;
            background: ${color};
        `;
        
        meteor.appendChild(glow);
        meteor.appendChild(trail);
        meteor.appendChild(head);
        
        this.elements.meteorShower.appendChild(meteor);

        const meteorData = {
            element: meteor,
            x: startX,
            y: -50,
            speed: speed,
            angle: angle,
            opacity: 0,
            fadeIn: true,
            fadeOut: false
        };

        this.meteors.push(meteorData);
    }

    updateMeteors() {
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            
            const radians = meteor.angle * Math.PI / 180;
            meteor.x += Math.cos(radians) * meteor.speed;
            meteor.y += Math.sin(radians) * meteor.speed;
            
            if (meteor.fadeIn) {
                meteor.opacity += 0.08;
                if (meteor.opacity >= 1) {
                    meteor.opacity = 1;
                    meteor.fadeIn = false;
                }
            }
            
            if (meteor.y > window.innerHeight * 0.7 && !meteor.fadeOut) {
                meteor.fadeOut = true;
            }
            
            if (meteor.fadeOut) {
                meteor.opacity -= 0.05;
                if (meteor.opacity <= 0) {
                    meteor.opacity = 0;
                    this.removeMeteor(i);
                    continue;
                }
            }
            
            meteor.element.style.transform = `translate(${meteor.x}px, ${meteor.y}px)`;
            meteor.element.style.opacity = meteor.opacity;
        }
    }

    removeMeteor(index) {
        const meteor = this.meteors[index];
        if (meteor && meteor.element) {
            meteor.element.remove();
        }
        this.meteors.splice(index, 1);
    }

    createCosmicDust() {
        const dustContainer = document.createElement('div');
        dustContainer.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden;';
        
        for (let i = 0; i < this.options.dustCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'cosmic-dust';
            
            const size = this.randomBetween(this.options.dustMinSize, this.options.dustMaxSize);
            const x = this.randomBetween(0, 100);
            const y = this.randomBetween(0, 100);
            const duration = this.randomBetween(10, 20);
            const delay = this.randomBetween(0, 10);
            const dustX = this.randomBetween(-30, 30);
            const dustY = this.randomBetween(-30, 30);
            
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
            
            dustContainer.appendChild(dust);
            this.dustParticles.push(dust);
        }
        
        this.container.appendChild(dustContainer);
        this.elements.dustContainer = dustContainer;
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (!this.isActive) return;

            if (timestamp - this.lastSpawnTime > this.options.meteorSpawnInterval) {
                this.createMeteor();
                this.lastSpawnTime = timestamp;
            }

            this.updateMeteors();
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
            if (meteor.element) {
                meteor.element.remove();
            }
        });
        this.meteors = [];
    }

    handleResize() {
        this.clearAll();
    }

    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    setOptions(options) {
        if (options.starCount) this.options.starCount = options.starCount;
        if (options.meteorCount) this.options.meteorCount = options.meteorCount;
        if (options.meteorMinSpeed) this.options.meteorMinSpeed = options.meteorMinSpeed;
        if (options.meteorMaxSpeed) this.options.meteorMaxSpeed = options.meteorMaxSpeed;
        if (options.meteorColors) this.options.meteorColors = options.meteorColors;
        if (options.meteorSpawnInterval) this.options.meteorSpawnInterval = options.meteorSpawnInterval;
    }
}
