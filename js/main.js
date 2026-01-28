// ===================================
// 粒子背景动画
// ===================================
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.connectionDistance = 150;
        this.mouseDistance = 200;
        
        this.mouse = {
            x: null,
            y: null
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = ['#00f5ff', '#7b2cbf', '#00ff88', '#ff00ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - distance / this.connectionDistance;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity * 0.5})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    drawMouseConnections() {
        if (this.mouse.x === null || this.mouse.y === null) return;

        this.particles.forEach(particle => {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouseDistance) {
                const opacity = 1 - distance / this.mouseDistance;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity * 0.8})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // 鼠标交互
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouseDistance) {
                    const force = (this.mouseDistance - distance) / this.mouseDistance;
                    const angle = Math.atan2(dy, dx);
                    particle.vx += Math.cos(angle) * force * 0.02;
                    particle.vy += Math.sin(angle) * force * 0.02;
                }
            }

            // 速度限制
            const maxSpeed = 2;
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > maxSpeed) {
                particle.vx = (particle.vx / speed) * maxSpeed;
                particle.vy = (particle.vy / speed) * maxSpeed;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.drawMouseConnections();
        this.updateParticles();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// 导航栏效果
// ===================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.addScrollEffect();
        this.addMobileMenu();
        this.addSmoothScroll();
    }

    addScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    addMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
    }

    addSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// 滚动动画
// ===================================
class ScrollAnimations {
    constructor() {
        this.fadeElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.skillProgress = document.querySelectorAll('.skill-progress');
        
        this.init();
    }

    init() {
        this.addIntersectionObserver();
        this.animateNumbers();
        this.animateSkillBars();
    }

    addIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'visible');
                }
            });
        }, observerOptions);

        this.fadeElements.forEach(element => {
            element.classList.add('fade-in');
            observer.observe(element);
        });
    }

    animateNumbers() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    this.animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.statNumbers.forEach(number => {
            observer.observe(number);
        });
    }

    animateValue(element, start, end, duration) {
        let startTime = null;
        
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + '+';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateSkillBars() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    entry.target.style.width = progress + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.skillProgress.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// ===================================
// 打字机效果
// ===================================
class Typewriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===================================
// 表单处理
// ===================================
class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // 模拟表单提交
        console.log('表单数据:', data);
        
        // 显示成功消息
        this.showSuccessMessage();
        
        // 重置表单
        this.form.reset();
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>消息发送成功！</span>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: rgba(0, 245, 255, 0.1);
            border: 2px solid #00f5ff;
            border-radius: 10px;
            color: #00f5ff;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// ===================================
// 项目卡片悬停效果
// ===================================
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }

    handleMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ===================================
// 技能卡片悬停效果
// ===================================
class SkillCards {
    constructor() {
        this.cards = document.querySelectorAll('.skill-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseEnter(card) {
        const icon = card.querySelector('.skill-icon');
        icon.style.transform = 'scale(1.1) rotate(10deg)';
        icon.style.boxShadow = '0 0 30px rgba(0, 245, 255, 0.8)';
    }

    handleMouseLeave(card) {
        const icon = card.querySelector('.skill-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
        icon.style.boxShadow = 'none';
    }
}

// ===================================
// 滚动进度条
// ===================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.createElement('div');
        this.init();
    }

    init() {
        this.progressBar.className = 'scroll-progress';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00f5ff, #7b2cbf, #00ff88);
            z-index: 10001;
            box-shadow: 0 0 10px rgba(0, 245, 255, 0.8);
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(this.progressBar);
        
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        this.progressBar.style.width = progress + '%';
    }
}

// ===================================
// 音乐播放器
// ===================================
class MusicPlayer {
    constructor() {
        this.playButton = document.getElementById('playButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.songProgress = document.getElementById('songProgress');
        this.progressContainer = document.getElementById('progressContainer');
        this.audioWave = document.getElementById('audioWave');
        this.songTitle = document.getElementById('songTitle');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.menuButton = document.getElementById('menuButton');
        this.modeButton = document.getElementById('modeButton');
        this.closeMenuButton = document.getElementById('closeMenuButton');
        this.songMenu = document.getElementById('songMenu');
        this.songList = document.getElementById('songList');
        this.currentTimeElement = document.getElementById('currentTime');
        this.totalTimeElement = document.getElementById('totalTime');
        this.isPlaying = false;
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.animationId = null;
        this.audio = null;
        this.currentSongIndex = 0;
        this.playMode = 'order'; // order, random, repeat
        this.songs = [
            {
                title: '花海 - 周杰伦',
                file: 'audio/花海-周杰伦.mp3'
            },
            {
                title: 'Electronic Dreams',
                file: 'audio/song1.mp3'
            },
            {
                title: 'Neon Lights',
                file: 'audio/song2.mp3'
            },
            {
                title: 'Digital Pulse',
                file: 'audio/song3.mp3'
            },
            {
                title: 'Synth Wave',
                file: 'audio/song4.mp3'
            },
            {
                title: 'Cyberpunk',
                file: 'audio/song5.mp3'
            }
        ];
        this.init();
    }

    init() {
        if (!this.playButton || !this.pauseButton) return;
        
        // 创建Audio对象
        this.audio = new Audio();
        this.audio.src = this.songs[this.currentSongIndex].file;
        this.audio.loop = false;
        
        // 绑定事件
        this.playButton.addEventListener('click', () => this.play());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        
        // 绑定控制按钮事件
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSong());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSong());
        }
        if (this.menuButton) {
            this.menuButton.addEventListener('click', () => this.toggleSongMenu());
        }
        if (this.modeButton) {
            this.modeButton.addEventListener('click', () => this.togglePlayMode());
        }
        if (this.closeMenuButton) {
            this.closeMenuButton.addEventListener('click', () => this.hideSongMenu());
        }
        
        // 绑定进度条点击事件
        if (this.progressContainer) {
            this.progressContainer.addEventListener('click', (e) => this.seek(e));
        }
        
        // 创建音频上下文
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
        } catch (error) {
            console.log('音频上下文创建失败:', error);
        }
        
        // 更新歌曲标题
        this.updateSongTitle();
        
        // 生成歌曲列表
        this.generateSongList();
        
        // 更新播放模式按钮
        this.updateModeButton();
    }

    play() {
        if (!this.audio) return;
        
        this.isPlaying = true;
        this.playButton.style.display = 'none';
        this.pauseButton.style.display = 'flex';
        
        // 恢复音频上下文
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // 只在第一次播放或音频源未连接时创建连接
        if (this.audioContext && this.analyser && !this.source) {
            try {
                this.source = this.audioContext.createMediaElementSource(this.audio);
                this.source.connect(this.analyser);
                this.source.connect(this.audioContext.destination);
            } catch (error) {
                console.log('音频源连接失败:', error);
            }
        }
        
        // 启动音频波形动画
        this.startWaveAnimation();
        
        // 播放音乐
        this.audio.play().catch(error => {
            console.log('播放失败:', error);
            this.isPlaying = false;
            this.playButton.style.display = 'flex';
            this.pauseButton.style.display = 'none';
        });
        
        console.log('音乐播放中...');
    }

    pause() {
        if (!this.audio) return;
        
        this.isPlaying = false;
        this.playButton.style.display = 'flex';
        this.pauseButton.style.display = 'none';
        
        // 停止音频波形动画
        this.stopWaveAnimation();
        
        // 暂停音乐
        this.audio.pause();
        
        console.log('音乐已暂停...');
    }

    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.audio.src = this.songs[this.currentSongIndex].file;
        this.updateSongTitle();
        this.updateSongList();
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    nextSong() {
        if (this.playMode === 'random') {
            // 随机播放
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentSongIndex && this.songs.length > 1);
            this.currentSongIndex = newIndex;
        } else if (this.playMode === 'repeat') {
            // 单曲循环，保持当前索引不变
            this.audio.currentTime = 0;
            if (this.isPlaying) {
                this.audio.play();
            }
            return;
        } else {
            // 顺序播放
            this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        }
        
        this.audio.src = this.songs[this.currentSongIndex].file;
        this.updateSongTitle();
        this.updateSongList();
        if (this.isPlaying) {
            this.audio.play();
        }
    }
    
    togglePlayMode() {
        // 切换播放模式：顺序 -> 随机 -> 单曲循环
        const modes = ['order', 'random', 'repeat'];
        const currentIndex = modes.indexOf(this.playMode);
        this.playMode = modes[(currentIndex + 1) % modes.length];
        
        // 更新播放模式按钮的样式或图标
        this.updateModeButton();
        
        console.log('播放模式已切换为:', this.playMode);
    }
    
    updateModeButton() {
        if (!this.modeButton) return;
        
        // 根据当前播放模式更新按钮图标
        let svgContent = '';
        switch (this.playMode) {
            case 'order':
                svgContent = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="19 20 9 12 19 4 19 20"/>
                        <line x1="5" y1="19" x2="5" y2="5"/>
                    </svg>
                `;
                break;
            case 'random':
                svgContent = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="19 20 9 12 19 4 19 20"/>
                        <line x1="5" y1="19" x2="5" y2="5"/>
                        <line x1="12" y1="12" x2="19" y2="12"/>
                        <line x1="12" y1="12" x2="12" y2="19"/>
                    </svg>
                `;
                break;
            case 'repeat':
                svgContent = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="19 20 9 12 19 4 19 20"/>
                        <line x1="5" y1="19" x2="5" y2="5"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                `;
                break;
        }
        
        this.modeButton.innerHTML = svgContent;
    }

    seek(e) {
        if (!this.audio || !this.progressContainer) return;
        
        const rect = this.progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = this.audio.duration;
        
        if (!isNaN(duration)) {
            const seekTime = (clickX / width) * duration;
            this.audio.currentTime = seekTime;
            console.log('跳转至:', seekTime, '秒');
            
            // 确保如果音乐之前是播放状态，在跳转后继续播放
            if (this.isPlaying && this.audio.paused) {
                this.audio.play().catch(error => {
                    console.log('播放失败:', error);
                });
            }
        }
    }

    toggleSongMenu() {
        if (this.songMenu) {
            if (this.songMenu.style.display === 'none' || this.songMenu.style.display === '') {
                this.showSongMenu();
            } else {
                this.hideSongMenu();
            }
        }
    }

    showSongMenu() {
        if (this.songMenu) {
            this.songMenu.style.display = 'block';
            this.generateSongList();
        }
    }

    hideSongMenu() {
        if (this.songMenu) {
            this.songMenu.style.display = 'none';
        }
    }

    generateSongList() {
        if (!this.songList) return;
        
        // 清空歌曲列表
        this.songList.innerHTML = '';
        
        // 生成歌曲列表
        this.songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = `song-item ${index === this.currentSongIndex ? 'active' : ''}`;
            songItem.addEventListener('click', () => this.selectSong(index));
            
            const songItemTitle = document.createElement('h4');
            songItemTitle.className = 'song-item-title';
            songItemTitle.textContent = song.title;
            
            const songItemDuration = document.createElement('p');
            songItemDuration.className = 'song-item-duration';
            songItemDuration.textContent = '未知时长';
            
            songItem.appendChild(songItemTitle);
            songItem.appendChild(songItemDuration);
            this.songList.appendChild(songItem);
        });
    }

    updateSongList() {
        if (!this.songList) return;
        
        const songItems = this.songList.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    selectSong(index) {
        if (index === this.currentSongIndex) {
            this.hideSongMenu();
            return;
        }
        
        this.currentSongIndex = index;
        this.audio.src = this.songs[this.currentSongIndex].file;
        this.updateSongTitle();
        this.updateSongList();
        
        if (this.isPlaying) {
            this.audio.play();
        }
        
        this.hideSongMenu();
    }

    updateSongTitle() {
        if (this.songTitle) {
            this.songTitle.textContent = this.songs[this.currentSongIndex].title;
        }
    }

    updateProgress() {
        if (!this.audio || !this.songProgress) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.songProgress) {
            this.songProgress.style.width = progress + '%';
        }
        
        // 更新时间显示
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        if (!this.audio) return;
        
        // 更新当前时间
        if (this.currentTimeElement) {
            const currentMinutes = Math.floor(this.audio.currentTime / 60);
            const currentSeconds = Math.floor(this.audio.currentTime % 60);
            this.currentTimeElement.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
        }
        
        // 更新总时间
        if (this.totalTimeElement && !isNaN(this.audio.duration)) {
            const totalMinutes = Math.floor(this.audio.duration / 60);
            const totalSeconds = Math.floor(this.audio.duration % 60);
            this.totalTimeElement.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        }
    }

    startWaveAnimation() {
        if (!this.audioWave) return;
        
        // 预创建波形点，避免频繁DOM操作
        this.createWavePoints();
        
        const animate = () => {
            if (!this.isPlaying) return;
            
            // 更新现有波形点的位置，而不是重新创建
            this.updateWavePoints();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopWaveAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    createWavePoints() {
        if (!this.audioWave) return;
        
        // 清除之前的波形点
        this.audioWave.innerHTML = '';
        this.wavePoints = [];
        
        // 创建固定数量的波形点
        const points = 8; // 减少波形点数量
        
        for (let i = 0; i < points; i++) {
            const point = document.createElement('div');
            const size = Math.random() * 3 + 1.5; // 减小点的大小
            
            point.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: var(--neon-green);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                opacity: 0.6;
                box-shadow: 0 0 5px var(--neon-green);
                animation: wave-point 1s ease-in-out infinite;
                animation-delay: ${i * 0.15}s;
            `;
            
            this.audioWave.appendChild(point);
            this.wavePoints.push(point);
        }
    }

    updateWavePoints() {
        if (!this.audioWave || !this.wavePoints) return;
        
        const points = this.wavePoints.length;
        const radius = 140; // 减小半径
        
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            // 使用音频数据或随机值生成波形高度
            const waveHeight = this.isPlaying ? Math.random() * 15 + 125 : 140;
            const x = Math.cos(angle) * waveHeight;
            const y = Math.sin(angle) * waveHeight;
            
            // 更新现有点的位置，避免重新创建DOM元素
            const point = this.wavePoints[i];
            point.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
    }
}

// ===================================
// 流星划过鼠标效果
// ===================================
class CursorFollower {
    constructor() {
        this.cursor = document.createElement('div');
        this.trail = document.createElement('div');
        this.trailParticles = [];
        this.maxParticles = 5; // 减少粒子数量提高性能
        this.lastX = 0;
        this.lastY = 0;
        this.mouseMoveTimeout = null;
        this.init();
    }

    init() {
        // 流星头部
        this.cursor.className = 'cursor-follower';
        this.cursor.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #ff00ff 0%, #00f5ff 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px #ff00ff, 0 0 20px #00f5ff;
            transition: opacity 0.1s ease;
        `;
        
        // 流星拖尾容器
        this.trail.className = 'cursor-trail';
        this.trail.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 9998;
        `;
        
        document.body.appendChild(this.trail);
        document.body.appendChild(this.cursor);
        
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // 添加悬停效果
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.handleMouseEnter());
            el.addEventListener('mouseleave', () => this.handleMouseLeave());
        });
    }

    createTrailParticle(x, y, opacity) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: linear-gradient(135deg, rgba(0, 245, 255, ${opacity}) 0%, rgba(255, 0, 255, ${opacity * 0.8}) 100%);
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(0, 245, 255, ${opacity});
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: trail-fade 0.3s ease-out forwards;
        `;
        
        this.trail.appendChild(particle);
        this.trailParticles.push(particle);
        
        // 限制粒子数量
        if (this.trailParticles.length > this.maxParticles) {
            const oldParticle = this.trailParticles.shift();
            oldParticle.remove();
        }
    }

    handleMouseMove(e) {
        // 节流处理鼠标移动事件
        if (this.mouseMoveTimeout) {
            clearTimeout(this.mouseMoveTimeout);
        }
        
        this.mouseMoveTimeout = setTimeout(() => {
            const x = e.clientX;
            const y = e.clientY;
            
            // 更新流星头部位置
            this.cursor.style.left = x - 3 + 'px';
            this.cursor.style.top = y - 3 + 'px';
            
            // 创建拖尾粒子 - 减少粒子数量
            const distance = Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2));
            const steps = Math.ceil(distance / 15); // 增加步长减少粒子
            
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const px = this.lastX + (x - this.lastX) * t;
                const py = this.lastY + (y - this.lastY) * t;
                const opacity = 1 - t;
                this.createTrailParticle(px - 1.5, py - 1.5, opacity);
            }
            
            this.lastX = x;
            this.lastY = y;
        }, 10); // 10ms节流
    }

    handleMouseEnter() {
        this.cursor.style.transform = 'scale(1.3)';
        this.cursor.style.boxShadow = '0 0 15px #ff00ff, 0 0 30px #00f5ff';
    }

    handleMouseLeave() {
        this.cursor.style.transform = 'scale(1)';
        this.cursor.style.boxShadow = '0 0 10px #ff00ff, 0 0 20px #00f5ff';
    }
}

// ===================================
// 初始化所有功能
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子背景
    new ParticleBackground();
    
    // 初始化导航栏
    new Navigation();
    
    // 初始化滚动动画
    new ScrollAnimations();
    
    // 初始化表单处理
    new FormHandler();
    
    // 初始化项目卡片效果
    new ProjectCards();
    
    // 初始化技能卡片效果
    new SkillCards();
    
    // 初始化滚动进度条
    new ScrollProgress();
    
    // 初始化鼠标跟随效果（仅在桌面端）
    if (window.innerWidth > 768) {
        new CursorFollower();
    }
    
    // 初始化音乐播放器
    new MusicPlayer();
    
    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* 流星拖尾动画 */
        @keyframes trail-fade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0.5);
            }
        }
        
        /* 隐藏默认鼠标 */
        body {
            cursor: none;
        }
        
        @media (max-width: 768px) {
            body {
                cursor: auto;
            }
            .cursor-follower,
            .cursor-trail {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// ===================================
// 窗口大小改变时重新初始化
// ===================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        location.reload();
    }, 500);
});