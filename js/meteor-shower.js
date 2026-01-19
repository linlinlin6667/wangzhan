class MeteorShower {
    constructor(container, options = {}) {
        this.container = container;
        this.meteors = [];
        this.maxMeteors = options.maxMeteors || 20;
        this.minSpeed = options.minSpeed || 3;
        this.maxSpeed = options.maxSpeed || 8;
        this.minSize = options.minSize || 2;
        this.maxSize = options.maxSize || 5;
        this.colors = options.colors || ['#00F0FF', '#7B61FF', '#FF00E6', '#00FF94'];
        this.isActive = true;
        this.animationId = null;
        this.lastSpawnTime = 0;
        this.spawnInterval = options.spawnInterval || 500;
        
        this.init();
    }

    init() {
        this.createMeteorBackground();
        this.startAnimation();
        window.addEventListener('resize', () => this.handleResize());
    }

    createMeteorBackground() {
        this.meteorBackground = document.createElement('div');
        this.meteorBackground.className = 'meteor-background';
        this.container.appendChild(this.meteorBackground);
    }

    createMeteor() {
        if (this.meteors.length >= this.maxMeteors) return;

        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        const size = this.randomBetween(this.minSize, this.maxSize);
        const startX = this.randomBetween(0, window.innerWidth);
        const speed = this.randomBetween(this.minSpeed, this.maxSpeed);
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const angle = this.randomBetween(45, 135);
        const length = this.randomBetween(100, 300);
        
        meteor.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: 0;
            box-shadow: 0 0 ${size * 3}px ${color};
            left: ${startX}px;
            top: -50px;
            pointer-events: none;
            will-change: transform, opacity;
        `;

        this.meteorBackground.appendChild(meteor);

        const meteorData = {
            element: meteor,
            x: startX,
            y: -50,
            speed: speed,
            angle: angle,
            length: length,
            opacity: 0,
            fadeIn: true,
            fadeOut: false,
            trail: []
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
                meteor.opacity += 0.05;
                if (meteor.opacity >= 1) {
                    meteor.opacity = 1;
                    meteor.fadeIn = false;
                }
            }
            
            if (meteor.y > window.innerHeight * 0.7 && !meteor.fadeOut) {
                meteor.fadeOut = true;
            }
            
            if (meteor.fadeOut) {
                meteor.opacity -= 0.03;
                if (meteor.opacity <= 0) {
                    meteor.opacity = 0;
                    this.removeMeteor(i);
                    continue;
                }
            }
            
            meteor.element.style.transform = `translate(${meteor.x}px, ${meteor.y}px)`;
            meteor.element.style.opacity = meteor.opacity;
            
            this.createTrail(meteor);
        }
    }

    createTrail(meteor) {
        if (Math.random() > 0.3) return;

        const trail = document.createElement('div');
        trail.className = 'meteor-trail';
        const size = meteor.element.offsetWidth * 0.6;
        
        trail.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${meteor.element.style.background};
            border-radius: 50%;
            opacity: ${meteor.opacity * 0.5};
            left: ${meteor.x}px;
            top: ${meteor.y}px;
            pointer-events: none;
            will-change: opacity;
            transition: opacity 0.3s ease;
        `;

        this.meteorBackground.appendChild(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => {
                trail.remove();
            }, 300);
        }, 50);
    }

    removeMeteor(index) {
        const meteor = this.meteors[index];
        if (meteor && meteor.element) {
            meteor.element.remove();
        }
        this.meteors.splice(index, 1);
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (!this.isActive) return;

            if (timestamp - this.lastSpawnTime > this.spawnInterval) {
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
        this.clearMeteors();
    }

    clearMeteors() {
        this.meteors.forEach(meteor => {
            if (meteor.element) {
                meteor.element.remove();
            }
        });
        this.meteors = [];
    }

    handleResize() {
        this.clearMeteors();
    }

    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    setOptions(options) {
        if (options.maxMeteors) this.maxMeteors = options.maxMeteors;
        if (options.minSpeed) this.minSpeed = options.minSpeed;
        if (options.maxSpeed) this.maxSpeed = options.maxSpeed;
        if (options.minSize) this.minSize = options.minSize;
        if (options.maxSize) this.maxSize = options.maxSize;
        if (options.colors) this.colors = options.colors;
        if (options.spawnInterval) this.spawnInterval = options.spawnInterval;
    }
}
