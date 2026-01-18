/**
 * My World - Main JavaScript
 * Bento Box Grid + Vibrant & Block-based Design
 * 
 * Features:
 * - Data Management (localStorage)
 * - CRUD Operations
 * - Animations & Interactions
 * - Performance Optimizations
 * - Accessibility Support
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    STORAGE_KEY: 'myWorldData',
    API_BASE_URL: '/api',
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    LAZY_LOAD_THRESHOLD: 100,
    SCROLL_REVEAL_THRESHOLD: 0.1
};

// ============================================
// State Management
// ============================================
const state = {
    personal: null,
    projects: [],
    skills: [],
    tools: [],
    websites: [],
    stats: {},
    isLoading: false,
    error: null
};

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
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

/**
 * Generate unique ID
 * @returns {string} Unique identifier
 */
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
const showNotification = (message, type = 'success', duration = 3000) => {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="关闭通知">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 400px;
        padding: 16px 20px;
        background: rgba(18, 18, 26, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: slideInRight 0.3s ease;
        color: white;
        font-family: 'DM Sans', sans-serif;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Auto remove
    const timeout = setTimeout(() => {
        removeNotification(notification);
    }, duration);

    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        removeNotification(notification);
    });

    // Add styles for animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-content i:first-child {
                font-size: 20px;
            }
            .notification-success i:first-child {
                color: #00FF94;
            }
            .notification-error i:first-child {
                color: #FF0055;
            }
            .notification-warning i:first-child {
                color: #FFD600;
            }
            .notification-info i:first-child {
                color: #00F0FF;
            }
            .notification-close {
                margin-left: auto;
                background: none;
                border: none;
                color: #B8B8C8;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
            }
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
};

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Icon name
 */
const getNotificationIcon = (type) => {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
};

/**
 * Remove notification with animation
 * @param {HTMLElement} notification - Notification element
 */
const removeNotification = (notification) => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        notification.remove();
    }, 300);
};

// ============================================
// Data Management
// ============================================

/**
 * Load data from localStorage
 * @returns {Object|null} Loaded data or null
 */
const loadDataFromStorage = () => {
    try {
        const storedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (storedData) {
            const data = JSON.parse(storedData);
            state.personal = data.personal;
            state.projects = data.projects || [];
            state.skills = data.skills || [];
            state.tools = data.tools || [];
            state.websites = data.websites || [];
            state.stats = data.stats || {};
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
        showNotification('加载数据失败', 'error');
        return null;
    }
};

/**
 * Save data to localStorage
 * @param {Object} data - Data to save
 */
const saveDataToStorage = (data) => {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        showNotification('保存数据失败', 'error');
    }
};

/**
 * Get default data
 * @returns {Object} Default data object
 */
const getDefaultData = () => ({
    personal: {
        name: '张三',
        title: '前端开发者 & 创意设计师',
        introduction: '热爱创造令人惊叹的数字体验',
        description: '我是一名充满激情的前端开发者，专注于创造美观、易用的Web应用。我相信好的设计不仅仅是视觉上的享受，更是功能与美学的完美结合。',
        avatar: 'https://picsum.photos/seed/avatar/400/400',
        email: 'hello@example.com',
        phone: '+86 138 0013 8000',
        location: '中国 · 北京',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
    },
    projects: [
        {
            id: generateId(),
            name: '电商平台',
            description: '全栈开发 · 现代化购物体验',
            image: 'https://picsum.photos/seed/project1/800/600',
            tags: ['React', 'Node.js', 'MongoDB'],
            link: '#',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: '管理系统',
            description: '企业级应用 · 高效管理',
            image: 'https://picsum.photos/seed/project2/800/600',
            tags: ['Vue', 'TypeScript', 'MySQL'],
            link: '#',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: '移动应用',
            description: '跨平台开发 · 流畅体验',
            image: 'https://picsum.photos/seed/project3/800/600',
            tags: ['React Native', 'Firebase'],
            link: '#',
            createdAt: new Date().toISOString()
        }
    ],
    skills: [
        { id: generateId(), name: 'HTML5', proficiency: 95, icon: 'fa-html5', color: '#00F0FF' },
        { id: generateId(), name: 'CSS3', proficiency: 90, icon: 'fa-css3-alt', color: '#FF00E6' },
        { id: generateId(), name: 'JavaScript', proficiency: 85, icon: 'fa-js', color: '#7B61FF' },
        { id: generateId(), name: 'React', proficiency: 80, icon: 'fa-react', color: '#00F0FF' },
        { id: generateId(), name: 'Vue', proficiency: 75, icon: 'fa-vuejs', color: '#FF00E6' },
        { id: generateId(), name: 'Node.js', proficiency: 70, icon: 'fa-node-js', color: '#7B61FF' }
    ],
    tools: [
        { id: generateId(), name: '开发工具', icon: 'fa-download', description: 'VS Code · WebStorm · Git', link: '#', color: '#00F0FF' },
        { id: generateId(), name: '学习资源', icon: 'fa-book', description: 'MDN · W3School · FreeCodeCamp', link: '#', color: '#FF00E6' },
        { id: generateId(), name: '设计资源', icon: 'fa-palette', description: 'Figma · Sketch · Dribbble', link: '#', color: '#7B61FF' },
        { id: generateId(), name: '云服务', icon: 'fa-cloud', description: 'GitHub · Vercel · Netlify', link: '#', color: '#00F0FF' },
        { id: generateId(), name: 'API文档', icon: 'fa-code-branch', description: 'MDN · RapidAPI · OpenAI', link: '#', color: '#FF00E6' },
        { id: generateId(), name: '数据库', icon: 'fa-database', description: 'MongoDB · PostgreSQL · Redis', link: '#', color: '#7B61FF' }
    ],
    websites: [
        { id: generateId(), name: 'GitHub', icon: 'fa-github', description: '代码托管平台', link: 'https://github.com', color: '#00F0FF' },
        { id: generateId(), name: 'Vercel', icon: 'fa-cloud', description: '部署平台', link: 'https://vercel.com', color: '#7B61FF' },
        { id: generateId(), name: 'Netlify', icon: 'fa-cloud-upload-alt', description: '静态网站托管', link: 'https://netlify.com', color: '#FF00E6' }
    ],
    stats: {
        experience: 5,
        projects: 50,
        clients: 30,
        commits: 100
    }
});

/**
 * Initialize data
 */
const initializeData = () => {
    const loadedData = loadDataFromStorage();
    if (!loadedData) {
        const defaultData = getDefaultData();
        saveDataToStorage(defaultData);
        state.personal = defaultData.personal;
        state.projects = defaultData.projects;
        state.skills = defaultData.skills;
        state.tools = defaultData.tools;
        state.stats = defaultData.stats;
    }
};

// ============================================
// CRUD Operations
// ============================================

/**
 * Create project
 * @param {Object} project - Project data
 * @returns {Object} Created project
 */
const createProject = (project) => {
    const newProject = {
        id: generateId(),
        ...project,
        createdAt: new Date().toISOString()
    };
    state.projects.unshift(newProject);
    saveDataToStorage({
        personal: state.personal,
        projects: state.projects,
        skills: state.skills,
        tools: state.tools,
        stats: state.stats
    });
    return newProject;
};

/**
 * Update project
 * @param {string} id - Project ID
 * @param {Object} updates - Project updates
 * @returns {Object|null} Updated project or null
 */
const updateProject = (id, updates) => {
    const index = state.projects.findIndex(p => p.id === id);
    if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...updates };
        saveDataToStorage({
            personal: state.personal,
            projects: state.projects,
            skills: state.skills,
            tools: state.tools,
            stats: state.stats
        });
        return state.projects[index];
    }
    return null;
};

/**
 * Delete project
 * @param {string} id - Project ID
 * @returns {boolean} Success status
 */
const deleteProject = (id) => {
    const index = state.projects.findIndex(p => p.id === id);
    if (index !== -1) {
        state.projects.splice(index, 1);
        saveDataToStorage({
            personal: state.personal,
            projects: state.projects,
            skills: state.skills,
            tools: state.tools,
            stats: state.stats
        });
        return true;
    }
    return false;
};

/**
 * Create skill
 * @param {Object} skill - Skill data
 * @returns {Object} Created skill
 */
const createSkill = (skill) => {
    const newSkill = {
        id: generateId(),
        ...skill
    };
    state.skills.push(newSkill);
    saveDataToStorage({
        personal: state.personal,
        projects: state.projects,
        skills: state.skills,
        tools: state.tools,
        stats: state.stats
    });
    return newSkill;
};

/**
 * Update skill
 * @param {string} id - Skill ID
 * @param {Object} updates - Skill updates
 * @returns {Object|null} Updated skill or null
 */
const updateSkill = (id, updates) => {
    const index = state.skills.findIndex(s => s.id === id);
    if (index !== -1) {
        state.skills[index] = { ...state.skills[index], ...updates };
        saveDataToStorage({
            personal: state.personal,
            projects: state.projects,
            skills: state.skills,
            tools: state.tools,
            stats: state.stats
        });
        return state.skills[index];
    }
    return null;
};

/**
 * Delete skill
 * @param {string} id - Skill ID
 * @returns {boolean} Success status
 */
const deleteSkill = (id) => {
    const index = state.skills.findIndex(s => s.id === id);
    if (index !== -1) {
        state.skills.splice(index, 1);
        saveDataToStorage({
            personal: state.personal,
            projects: state.projects,
            skills: state.skills,
            tools: state.tools,
            stats: state.stats
        });
        return true;
    }
    return false;
};

/**
 * Create tool
 * @param {Object} tool - Tool data
 * @returns {Object} Created tool
 */
const createTool = (tool) => {
    const newTool = {
        id: generateId(),
        ...tool
    };
    state.tools.push(newTool);
    saveDataToStorage({
        personal: state.personal,
        projects: state.projects,
        skills: state.skills,
        tools: state.tools,
        stats: state.stats
    });
    return newTool;
};

/**
 * Update tool
 * @param {string} id - Tool ID
 * @param {Object} updates - Tool updates
 * @returns {Object|null} Updated tool or null
 */
const updateTool = (id, updates) => {
    const index = state.tools.findIndex(t => t.id === id);
    if (index !== -1) {
        state.tools[index] = { ...state.tools[index], ...updates };
        saveDataToStorage({
            personal: state.personal,
            projects: state.projects,
            skills: state.skills,
            tools: state.tools,
            stats: state.stats
        });
        return state.tools[index];
    }
    return null;
};

/**
 * Delete tool
 * @param {string} id - Tool ID
 * @returns {boolean} Success status
 */
const deleteTool = (id) => {
    const index = state.tools.findIndex(t => t.id === id);
    if (index !== -1) {
        state.tools.splice(index, 1);
        saveDataToStorage({
            personal: state.personal,
            projects: state.projects,
            skills: state.skills,
            tools: state.tools,
            stats: state.stats
        });
        return true;
    }
    return false;
};

// ============================================
// UI Updates
// ============================================

/**
 * Update personal info on page
 */
const updatePersonalInfo = () => {
    if (!state.personal) return;

    const elements = {
        name: document.querySelector('.profile-name'),
        title: document.querySelector('.profile-title'),
        description: document.querySelector('.profile-description'),
        avatar: document.querySelector('.avatar img')
    };

    if (elements.name) elements.name.textContent = state.personal.name;
    if (elements.title) elements.title.textContent = state.personal.title;
    if (elements.description) elements.description.textContent = state.personal.description;
    if (elements.avatar) elements.avatar.src = state.personal.avatar;
};

/**
 * Update projects on page
 */
const updateProjects = () => {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = state.projects.map((project, index) => `
        <article class="project-card group bg-[#12121A] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-[${project.color || '#00F0FF'}]/50 hover:shadow-[0_0_40px_rgba(${hexToRgb(project.color || '#00F0FF')},0.2)] hover:-translate-y-2" data-id="${project.id}">
            <div class="project-image relative aspect-video overflow-hidden">
                <img src="${project.image}" alt="${project.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
                <div class="project-overlay absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <a href="${project.link}" class="btn-view inline-flex items-center gap-2 px-6 py-3 bg-[${project.color || '#00F0FF'}] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                        <span>查看详情</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
            <div class="project-details p-6">
                <h3 class="project-name font-['Space_Grotesk'] text-xl font-bold mb-2 group-hover:text-[${project.color || '#00F0FF'}] transition-colors">
                    ${project.name}
                </h3>
                <p class="project-description text-[#B8B8C8] text-sm mb-4">
                    ${project.description}
                </p>
                <div class="project-tags flex flex-wrap gap-2">
                    ${project.tags.map(tag => `
                        <span class="tag px-3 py-1 bg-[${project.color || '#00F0FF'}]/10 border border-[${project.color || '#00F0FF'}]/30 rounded-full text-[${project.color || '#00F0FF'}] text-xs font-medium">${tag}</span>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');
};

/**
 * Update skills on page
 */
const updateSkills = () => {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;

    skillsGrid.innerHTML = state.skills.map(skill => `
        <div class="skill-card group bg-[#12121A] backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center transition-all duration-500 hover:border-[${skill.color}]/50 hover:shadow-[0_0_40px_rgba(${hexToRgb(skill.color)},0.2)] hover:-translate-y-2" data-id="${skill.id}">
            <div class="skill-icon w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[${skill.color}]/20 to-[${skill.color}]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i class="fab ${skill.icon} text-[${skill.color}] text-3xl"></i>
            </div>
            <h3 class="skill-name font-['Space_Grotesk'] text-lg font-bold mb-3 group-hover:text-[${skill.color}] transition-colors">
                ${skill.name}
            </h3>
            <div class="skill-bar h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="skill-progress h-full bg-gradient-to-r from-[${skill.color}] to-[${adjustColor(skill.color, -20)}] rounded-full transition-all duration-1000" style="width: ${skill.proficiency}%"></div>
            </div>
            <div class="skill-percentage text-[${skill.color}] text-sm font-semibold mt-2">${skill.proficiency}%</div>
        </div>
    `).join('');
};

/**
 * Update tools on page
 */
const updateTools = () => {
    const toolsGrid = document.querySelector('.tools-grid');
    if (!toolsGrid) return;

    toolsGrid.innerHTML = state.tools.map(tool => `
        <div class="tool-card group bg-[#12121A] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 hover:border-[${tool.color}]/50 hover:shadow-[0_0_40px_rgba(${hexToRgb(tool.color)},0.2)] hover:-translate-y-2" data-id="${tool.id}">
            <div class="tool-icon w-14 h-14 rounded-xl bg-gradient-to-br from-[${tool.color}]/20 to-[${tool.color}]/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <i class="fas ${tool.icon} text-[${tool.color}] text-xl"></i>
            </div>
            <div class="tool-content flex-1">
                <h3 class="tool-name font-['Space_Grotesk'] text-lg font-bold mb-1 group-hover:text-[${tool.color}] transition-colors">
                    ${tool.name}
                </h3>
                <p class="tool-description text-[#B8B8C8] text-sm mb-3">
                    ${tool.description}
                </p>
                <a href="${tool.link}" class="tool-link inline-flex items-center gap-1 text-[${tool.color}] text-sm font-semibold group-hover:gap-2 transition-all">
                    <span>访问</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
};

/**
 * Update stats on page
 */
const updateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((element, index) => {
        const statLabel = element.nextElementSibling?.textContent;
        const statKey = getStatKey(statLabel);
        const targetValue = state.stats[statKey] || 0;
        animateNumber(element, targetValue);
    });
};

/**
 * Update websites on page
 */
const updateWebsites = () => {
    const websitesList = document.querySelector('.websites-list');
    if (!websitesList) return;

    if (state.websites.length === 0) {
        websitesList.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-globe text-6xl text-[#B8B8C8] mb-4"></i>
                <p class="text-[#B8B8C8] text-lg">暂无网站链接</p>
                <p class="text-[#B8B8C8] text-sm mt-2">添加您的第一个网站链接吧！</p>
            </div>
        `;
        return;
    }

    websitesList.innerHTML = state.websites.map(website => `
        <a href="${website.link}" target="_blank" class="website-card group bg-[#12121A] backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:border-[${website.color || '#00F0FF'}]/50 hover:shadow-[0_0_40px_rgba(${hexToRgb(website.color || '#00F0FF')},0.2)] hover:-translate-y-2 flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[${website.color || '#00F0FF'}]/20 to-[${website.color || '#00F0FF'}]/5 flex items-center justify-center flex-shrink-0">
                <i class="fab ${website.icon} text-[${website.color || '#00F0FF'}] text-2xl"></i>
            </div>
            <div class="flex-1">
                <h3 class="font-['Space_Grotesk'] text-xl font-bold mb-2 group-hover:text-[${website.color || '#00F0FF'}] transition-colors duration-300">
                    ${website.name}
                </h3>
                <p class="text-[#B8B8C8] text-sm">
                    ${website.description}
                </p>
            </div>
            <i class="fas fa-arrow-right text-[#B8B8C8] group-hover:text-[${website.color || '#00F0FF'}] group-hover:translate-x-1 transition-all duration-300"></i>
        </a>
    `).join('');
};

/**
 * Create website
 * @param {Object} website - Website object
 * @returns {boolean} Success status
 */
const createWebsite = (website) => {
    try {
        state.websites.push(website);
        updateWebsites();
        showNotification('网站添加成功！', 'success');
        return true;
    } catch (error) {
        console.error('Error creating website:', error);
        showNotification('添加网站失败', 'error');
        return false;
    }
};

/**
 * Update website
 * @param {string} id - Website ID
 * @param {Object} updates - Updates to apply
 * @returns {boolean} Success status
 */
const updateWebsite = (id, updates) => {
    try {
        const index = state.websites.findIndex(w => w.id === id);
        if (index !== -1) {
            state.websites[index] = { ...state.websites[index], ...updates };
            updateWebsites();
            showNotification('网站更新成功！', 'success');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating website:', error);
        showNotification('更新网站失败', 'error');
        return false;
    }
};

/**
 * Delete website
 * @param {string} id - Website ID
 * @returns {boolean} Success status
 */
const deleteWebsite = (id) => {
    try {
        state.websites = state.websites.filter(w => w.id !== id);
        updateWebsites();
        showNotification('网站删除成功！', 'success');
        return true;
    } catch (error) {
        console.error('Error deleting website:', error);
        showNotification('删除网站失败', 'error');
        return false;
    }
};

/**
 * Get stat key from label
 * @param {string} label - Stat label
 * @returns {string} Stat key
 */
const getStatKey = (label) => {
    const keyMap = {
        '年经验': 'experience',
        '项目完成': 'projects',
        '满意客户': 'clients',
        '代码提交': 'commits'
    };
    return keyMap[label] || 'experience';
};

// ============================================
// Animations
// ============================================

/**
 * Animate number from 0 to target
 * @param {HTMLElement} element - Target element
 * @param {number} target - Target value
 * @param {number} duration - Animation duration in milliseconds
 */
const animateNumber = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const animate = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(animate);
        } else {
            element.textContent = target;
        }
    };
    
    animate();
};

/**
 * Initialize scroll reveal animations
 */
const initScrollReveal = () => {
    const observerOptions = {
        threshold: CONFIG.SCROLL_REVEAL_THRESHOLD,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const revealElements = document.querySelectorAll(
        '.bento-card, .project-card, .skill-card, .tool-card, .info-card, .section-title'
    );
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add reveal styles
    if (!document.querySelector('#reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.textContent = `
            .reveal {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
};

// ============================================
// Event Handlers
// ============================================

/**
 * Initialize navigation
 */
const initNavigation = () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active link
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, CONFIG.THROTTLE_DELAY));

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('show');
    });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile menu
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
};

/**
 * Initialize cursor glow effect
 */
const initCursorGlow = () => {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow) return;

    document.addEventListener('mousemove', throttle((e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    }, CONFIG.THROTTLE_DELAY));
};

/**
 * Initialize contact form
 */
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('请填写所有必填字段', 'error');
            return;
        }

        // Simulate API call
        try {
            // In production, you would send this to your backend
            console.log('Form submitted:', data);
            showNotification('消息发送成功！我们会尽快回复您。', 'success');
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('发送失败，请稍后重试', 'error');
        }
    });
};

/**
 * Initialize lazy loading
 */
const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback to Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
};

// ============================================
// Utility Functions for Colors
// ============================================

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color
 * @returns {string} RGB color
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 240, 255';
};

/**
 * Adjust color brightness
 * @param {string} hex - Hex color
 * @param {number} amount - Amount to adjust (-100 to 100)
 * @returns {string} Adjusted hex color
 */
const adjustColor = (hex, amount) => {
    let color = hex.replace('#', '');
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// ============================================
// Keyboard Navigation
// ============================================

/**
 * Initialize keyboard navigation
 */
const initKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
        // Escape key to close modals/menus
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (mobileMenu.classList.contains('show')) {
                mobileMenu.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }

        // Tab key trap for modals (if any)
        if (e.key === 'Tab') {
            const modal = document.querySelector('[role="dialog"]');
            if (modal) {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
};

// ============================================
// Performance Monitoring
// ============================================

/**
 * Initialize performance monitoring
 */
const initPerformanceMonitoring = () => {
    // Log page load time
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.warn(`Long task detected: ${entry.duration}ms`);
            });
        });
        observer.observe({ entryTypes: ['longtask'] });
    }
};

// ============================================
// Main Initialization
// ============================================

/**
 * Initialize application
 */
const initApp = () => {
    // Initialize data
    initializeData();

    // Initialize UI updates
    updatePersonalInfo();
    updateProjects();
    updateSkills();
    updateTools();
    updateWebsites();
    updateStats();

    // Initialize features
    initNavigation();
    initCursorGlow();
    initContactForm();
    initScrollReveal();
    initLazyLoading();
    initKeyboardNavigation();
    initPerformanceMonitoring();

    // Expose functions to global scope for admin panel
    window.MyWorldAPI = {
        state,
        createProject,
        updateProject,
        deleteProject,
        createSkill,
        updateSkill,
        deleteSkill,
        createTool,
        updateTool,
        deleteTool,
        createWebsite,
        updateWebsite,
        deleteWebsite,
        updatePersonalInfo,
        updateProjects,
        updateSkills,
        updateTools,
        updateWebsites,
        updateStats,
        showNotification
    };

    console.log('My World initialized successfully');
};

// ============================================
// DOM Ready
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ============================================
// Export for Module Usage
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        state,
        createProject,
        updateProject,
        deleteProject,
        createSkill,
        updateSkill,
        deleteSkill,
        createTool,
        updateTool,
        deleteTool,
        showNotification
    };
}
