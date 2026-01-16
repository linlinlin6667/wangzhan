document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    initParticles();
    initNavbarScroll();
    initSmoothScroll();
    init3DCardFlip();
    initNumberAnimation();
    initContactForm();
    initMouseGlow();
    initScrollReveal();
});

function loadDataFromStorage() {
    const storedData = localStorage.getItem('websiteData');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            updatePageContent(data);
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
    } else {
        loadDefaultData();
    }
}

function loadDefaultData() {
    const defaultData = {
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
    
    updatePageContent(defaultData);
    saveDataToStorage(defaultData);
}

function updatePageContent(data) {
    updatePersonalInfo(data.personal);
    updateProjects(data.projects);
    updateTools(data.tools);
    updateSkills(data.skills);
    updateStats(data.stats);
}

function updatePersonalInfo(personal) {
    if (!personal) return;
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = personal.name || '张三';
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = personal.title || '前端开发者 & 创意设计师';
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.innerHTML = personal.description || '热爱创造令人惊叹的数字体验<br>追求完美，不断突破';
}

function updateProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image">
                <div class="project-overlay">
                    <div class="project-info">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <a href="#" class="btn-view">查看详情</a>
                    </div>
                </div>
                <img src="${project.image}" alt="${project.name}">
            </div>
            <div class="project-details">
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

function updateTools(tools) {
    const toolsGrid = document.querySelector('.tools-grid');
    if (!toolsGrid) return;
    
    toolsGrid.innerHTML = '';
    
    tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
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
}

function updateSkills(skills) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;
    
    skillsGrid.innerHTML = '';
    
    skills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <div class="skill-icon">
                <i class="fab ${skill.icon}"></i>
            </div>
            <div class="skill-info">
                <h3>${skill.name}</h3>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.proficiency}%"></div>
                </div>
            </div>
        `;
        skillsGrid.appendChild(skillItem);
    });
}

function updateStats(stats) {
    const statItems = document.querySelectorAll('.stat-item');
    if (!statItems.length) return;
    
    statItems.forEach((item, index) => {
        const statNumber = item.querySelector('.stat-number');
        if (statNumber) {
            const key = item.querySelector('.stat-label').textContent.trim();
            const value = stats[key] || 0;
            animateNumber(statNumber, value);
        }
    });
}

function saveDataToStorage(data) {
    localStorage.setItem('websiteData', JSON.stringify(data));
}

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.4 + 0.2;
        particlesContainer.appendChild(particle);
    }
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
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
    });
}

function initSmoothScroll() {
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

function init3DCardFlip() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -20;
            const rotateY = (x - centerX) / centerX * 20;
            
            card.style.transform = `perspective(1000px) rotateY(${rotateX}deg) rotateX(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });
}

function initNumberAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                animateNumber(target, finalValue);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

function animateNumber(element, target) {
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

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        showNotification('消息发送成功！', 'success');
        form.reset();
    });
}

function initMouseGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX - 20 + 'px';
        cursorGlow.style.top = e.clientY - 20 + 'px';
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-title, .card, .tool-card, .skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-dark);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

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
    
    .notification-success {
        border-left: 4px solid var(--success);
    }
    
    .notification-error {
        border-left: 4px solid #FF0055;
    }
`;
document.head.appendChild(style);
