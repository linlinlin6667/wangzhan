/**
 * My World - Aurora UI + Bento Grid
 * 优化的JavaScript实现
 */

// ==========================================
// 工具函数
// ==========================================

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==========================================
// 性能优化的Intersection Observer
// ==========================================

const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// ==========================================
// 数据管理
// ==========================================

const DataManager = {
    STORAGE_KEY: 'websiteData',

    load() {
        try {
            const storedData = localStorage.getItem(this.STORAGE_KEY);
            if (storedData) {
                return JSON.parse(storedData);
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
        return this.getDefaultData();
    },

    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    },

    getDefaultData() {
        return {
            personal: {
                name: '张三',
                title: '前端开发者 & 创意设计师',
                introduction: '热爱创造令人惊叹的数字体验',
                description: '我是一名充满激情的前端开发者，专注于创造美观、易用的Web应用。',
                avatar: 'https://picsum.photos/seed/avatar/300/300',
                email: 'hello@example.com',
                phone: '+86 138 0013 8000',
                location: '中国 · 北京'
            },
            projects: [
                {
                    id: 1,
                    name: '电商平台',
                    description: '全栈开发',
                    image: 'https://picsum.photos/seed/project1/600/400',
                    tags: ['React', 'Node.js', 'MongoDB']
                },
                {
                    id: 2,
                    name: '管理系统',
                    description: '企业级应用',
                    image: 'https://picsum.photos/seed/project2/600/400',
                    tags: ['Vue', 'TypeScript', 'MySQL']
                },
                {
                    id: 3,
                    name: '移动应用',
                    description: '跨平台开发',
                    image: 'https://picsum.photos/seed/project3/600/400',
                    tags: ['React Native', 'Firebase']
                }
            ],
            tools: [
                {
                    id: 1,
                    name: '开发工具',
                    icon: 'fa-download',
                    description: 'VS Code · WebStorm · Git',
                    link: '#'
                },
                {
                    id: 2,
                    name: '学习资源',
                    icon: 'fa-book',
                    description: 'MDN · W3School · FreeCodeCamp',
                    link: '#'
                },
                {
                    id: 3,
                    name: '设计资源',
                    icon: 'fa-palette',
                    description: 'Figma · Sketch · Dribbble',
                    link: '#'
                },
                {
                    id: 4,
                    name: '云服务',
                    icon: 'fa-cloud',
                    description: 'GitHub · Vercel · Netlify',
                    link: '#'
                },
                {
                    id: 5,
                    name: 'API文档',
                    icon: 'fa-code-branch',
                    description: 'MDN · RapidAPI · OpenAI',
                    link: '#'
                },
                {
                    id: 6,
                    name: '数据库',
                    icon: 'fa-database',
                    description: 'MongoDB · PostgreSQL · Redis',
                    link: '#'
                }
            ],
            skills: [
                {
                    id: 1,
                    name: 'HTML5',
                    proficiency: 95,
                    icon: 'fa-html5'
                },
                {
                    id: 2,
                    name: 'CSS3',
                    proficiency: 90,
                    icon: 'fa-css3-alt'
                },
                {
                    id: 3,
                    name: 'JavaScript',
                    proficiency: 85,
                    icon: 'fa-js'
                },
                {
                    id: 4,
                    name: 'React',
                    proficiency: 80,
                    icon: 'fa-react'
                },
                {
                    id: 5,
                    name: 'Vue',
                    proficiency: 75,
                    icon: 'fa-vuejs'
                },
                {
                    id: 6,
                    name: 'Node.js',
                    proficiency: 70,
                    icon: 'fa-node-js'
                }
            ],
            stats: {
                experience: 5,
                projects: 50,
                clients: 30,
                commits: 100
            }
        };
    }
};

// ==========================================
// UI更新器
// ==========================================

const UIUpdater = {
    updatePersonalInfo(personal) {
        if (!personal) return;

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = personal.name || '张三';

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = personal.title || '前端开发者 & 创意设计师';

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription) heroDescription.innerHTML = personal.description || '热爱创造令人惊叹的数字体验<br>追求完美，不断突破';
    },

    updateProjects(projects) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card animate-on-scroll';
            projectCard.innerHTML = `
                <div class="project-image">
                    <div class="project-overlay">
                        <div class="project-info">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <a href="#" class="btn-view">查看详情</a>
                        </div>
                    </div>
                    <img src="${project.image}" alt="${project.name}" loading="lazy">
                </div>
                <div class="project-details">
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });

        // 重新初始化3D效果
        ProjectCards.init();
    },

    updateTools(tools) {
        const toolsGrid = document.querySelector('.tools-grid');
        if (!toolsGrid) return;

        toolsGrid.innerHTML = '';

        tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card animate-on-scroll';
            toolCard.innerHTML = `
                <div class="tool-icon">
                    <i class="fas ${tool.icon}"></i>
                </div>
                <div class="tool-content">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                    <a href="${tool.link}" class="tool-link">访问</a>
                </div>
            `;
            toolsGrid.appendChild(toolCard);
        });
    },

    updateSkills(skills) {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;

        skillsGrid.innerHTML = '';

        skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item animate-on-scroll';
            skillItem.innerHTML = `
                <div class="skill-icon">
                    <i class="fab ${skill.icon}"></i>
                </div>
                <div class="skill-info">
                    <h3>${skill.name}</h3>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="${skill.proficiency}%"></div>
                    </div>
                </div>
            `;
            skillsGrid.appendChild(skillItem);
        });

        // 重新初始化技能条动画
        SkillsSection.init();
    },

    updateStats(stats) {
        const statItems = document.querySelectorAll('.stat-item');
        if (!statItems.length) return;

        statItems.forEach((item, index) => {
            const statNumber = item.querySelector('.stat-number');
            if (statNumber) {
                const label = item.querySelector('.stat-label').textContent.trim();
                const value = stats[label] || 0;
                statNumber.setAttribute('data-target', value);
            }
        });

        // 重新初始化数字动画
        StatsSection.init();
    }
};

// ==========================================
// 导航栏
// ==========================================

const Navbar = {
    init() {
        const navbar = document.querySelector('.navbar');
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        // 滚动效果
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // 更新活动链接
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100));

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// ==========================================
// 极光背景
// ==========================================

const AuroraBackground = {
    init() {
        const container = document.querySelector('.aurora-background');
        if (!container) return;

        // 创建极光层
        for (let i = 0; i < 3; i++) {
            const layer = document.createElement('div');
            layer.className = 'aurora-layer';
            container.appendChild(layer);
        }
    }
};

// ==========================================
// 粒子系统
// ==========================================

const Particles = {
    init() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 30; // 减少粒子数量以提升性能

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
            particle.style.width = (Math.random() * 3 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.3 + 0.2;
            particlesContainer.appendChild(particle);
        }
    }
};

// ==========================================
// 项目卡片3D效果
// ==========================================

const ProjectCards = {
    init() {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', throttle((e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;

                card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }, 50));

            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
            });
        });
    }
};

// ==========================================
// 统计数字动画
// ==========================================

const StatsSection = {
    init() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-target'));
                    this.animateNumber(target, finalValue);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(number => {
            observer.observe(number);
        });
    },

    animateNumber(element, target) {
        let current = 0;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const interval = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);

            if (current >= target) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, interval);
    }
};

// ==========================================
// 技能条动画
// ==========================================

const SkillsSection = {
    init() {
        const skillBars = document.querySelectorAll('.skill-progress');

        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            bar.style.width = '0%';
            observer.observe(bar);
        });
    }
};

// ==========================================
// 滚动显示动画
// ==========================================

const ScrollReveal = {
    init() {
        const revealElements = document.querySelectorAll('.animate-on-scroll');

        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
};

// ==========================================
// 联系表单
// ==========================================

const ContactForm = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // 模拟表单提交
            this.showNotification('消息发送成功！我们会尽快回复您。', 'success');
            form.reset();
        });
    },

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--bg-primary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-2xl);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
};

// ==========================================
// 性能监控
// ==========================================

const PerformanceMonitor = {
    init() {
        // 监控页面加载时间
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });

        // 监控长任务
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`Long task detected: ${entry.duration}ms`);
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        }
    }
};

// ==========================================
// 初始化
// ==========================================

const App = {
    init() {
        // 加载数据
        const data = DataManager.load();
        UIUpdater.updatePersonalInfo(data.personal);
        UIUpdater.updateProjects(data.projects);
        UIUpdater.updateTools(data.tools);
        UIUpdater.updateSkills(data.skills);
        UIUpdater.updateStats(data.stats);

        // 保存默认数据
        DataManager.save(data);

        // 初始化各个模块
        AuroraBackground.init();
        Particles.init();
        Navbar.init();
        ProjectCards.init();
        StatsSection.init();
        SkillsSection.init();
        ScrollReveal.init();
        ContactForm.init();

        // 性能监控（开发环境）
        if (process.env.NODE_ENV === 'development') {
            PerformanceMonitor.init();
        }

        console.log('My World - Aurora UI initialized successfully!');
    }
};

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// 导出供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, DataManager, UIUpdater };
}
